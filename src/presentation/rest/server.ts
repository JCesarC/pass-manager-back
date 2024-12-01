import path from 'path';
import http, { Server as ServerInstance } from 'http';

import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { AppInfo, AppConfig } from './config';

import mainRouter from './router';

import passportConfig from '../../infrastructure/authentication/passport/passportConfig';

import swaggerDoc from '../../../public/swagger.json';
import { closeDBConnection, forceCloseDBConnection, startDBConnection } from '../../infrastructure/persistance/mongoose/connection';
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
    this.app.use('/api', mainRouter);
    this.app.use(express.static(path.join(__dirname, '..','..','..', 'public', 'docs')));
    this.app.use('/', (req, res) => {
      res.sendFile(path.join(__dirname, '..','..','..', 'public', 'docs', 'index.html'));
    });
    // * TODO: Add Error handling with tsoa
  }

  private showBanner(): void {
    const banner = `
      Application starrted successssssssfully!
      Name: ${AppInfo.APP_NAME}
      Port: ${AppConfig.PORT}
      BasePath: ${AppConfig.BASE_PATH}
      OpenApi Spec Path: /api/docs
    `;
    // this.logger.log({
    //   level: 'info',
    //   message: 'Server started'
    // });
    console.log(banner);
  }

  private async startServer(): Promise<void> {
    await startDBConnection();
    this.configureExpress();
    this.httpServer = http.createServer(this.app);
    this.httpServer.listen(process.env.PORT || 3000, () => {
      this.showBanner();
    });
  }

  public async exec(): Promise<void> {
    await this.startServer();
  }
  public async stopServer(message = '') {
    await closeDBConnection();
    console.log(message);
    process.exit();
  }

  public forceStopServer(message = ''){
    console.log(message);
    forceCloseDBConnection();
    process.exit(1);
  }

  public logErrorAndTerminate(error: string){
    this.stopServer(`shutting down the server...${error}`);
  }
}

export { Server };
