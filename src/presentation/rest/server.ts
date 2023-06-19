import cors from 'cors';
import helmet from 'helmet';

import express from 'express';
import morgan from 'morgan';

import passportConfig from '../../infrastructure/authentication/passport/passportConfig';

import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../../public/swagger.json';
import mainRooter from './router';
import path from 'path';
import { AppInfo, AppConfig } from './config';
import compression from 'compression';
import http, { Server as ServerInstance } from 'http';
import { closeDBConnection, forceCloseDBConnection } from '../../infrastructure/persistance/mongoose';
// import winston from 'winston';

class Server{
  private app;
  private httpServer!: ServerInstance;
  private swaggerOptions;
  // private logger = winston.createLogger({
  //   transports: [
  //     new winston.transports.Console(),
  //     new winston.transports.File({ filename: 'combined.log' })
  //   ]
  // });

  constructor() {
    this.app = express();
    this.swaggerOptions = {
      explorer: true
    };
  }

  private configureExpress():void {
    this.app.use(helmet());
    this.app.use(morgan('tiny'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true, limit: '50mb'}));
    this.app.use(compression({}));
    this.app.use(passportConfig.initialize());
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, this.swaggerOptions));
    this.app.use('/api', mainRooter);
    this.app.use(express.static(path.join(__dirname, '..','..','..', 'public', 'docs')));
    this.app.use('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..','..','..', 'public', 'docs', 'index.html'));
    });
    // * TODO: Add Error handling with tsoa
  }

  private showBanner(): void {
    const banner = `
      Application started successfully!
      Name: ${AppInfo.APP_NAME}
      Port: ${AppConfig.PORT}
      BasePath: ${AppConfig.BASE_PATH}
      OpenApi Spec Path: ${AppConfig.BASE_PATH}/docs
    `;
    // this.logger.log({
    //   level: 'info',
    //   message: 'Server started'
    // });
    console.log(banner);
  }

  private startServer(): void {
    this.httpServer.listen(AppConfig.PORT, () => {
      this.showBanner();
    });
  }

  private createServer(): void{
    this.httpServer = http.createServer(this.app);
  };

  public exec(): void {
    this.configureExpress();
    this.createServer();
    this.startServer();
  }

  public async stopServer(message = '') {
    console.log(message);
    await closeDBConnection();
    process.exit();
  }

  public forceStopServer(message = ''){
    console.log(message);
    forceCloseDBConnection();
    process.exit(1);
  }

  public logErrorAndTerminate(error: string){
    console.log(error);
    this.stopServer();
  }
}

export { Server };
