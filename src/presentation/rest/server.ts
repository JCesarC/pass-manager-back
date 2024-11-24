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
import MongoDBClient from '../../infrastructure/persistance/mongoose/connection';

class Server{
  private app;
  private httpServer!: ServerInstance;
  private swaggerOptions;
  private bdClient: MongoDBClient;
  // private logger = winston.createLogger({
  //   transports: [
  //     new winston.transports.Console(),
  //     new winston.transports.File({ filename: 'combined.log' })
  //   ]
  // });

  constructor(bdClient: MongoDBClient) {
    this.app = express();
    this.swaggerOptions = {
      explorer: true
    };
    this.bdClient = bdClient;
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
      Application started successsssssssfully!
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

  private async startServer(): Promise<void> {
    await this.bdClient.startDBConnection();
    this.httpServer = http.createServer(this.app);
    this.httpServer.listen(process.env.PORT || 3000, () => {
      this.showBanner();
    });
  }

  public async exec(): Promise<void> {
    await this.startServer();
  }
  public async stopServer(message = '') {
    console.log(message);
    await this.bdClient.closeDBConnection();
    process.exit();
  }

  public async forceStopServer(message = ''){
    console.log(message);
    await this.bdClient.closeDBConnection();
    process.exit(1);
  }

  public logErrorAndTerminate(error: string){
    console.log(error);
    this.stopServer();
  }
}

export { Server };
