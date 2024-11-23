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
  private mongoClient: MongoDBClient;
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
    this.mongoClient = new MongoDBClient();
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

  private async startDBsConnections(){
    await this.mongoClient.startDBConnection();
  }

  public async exec(): Promise<void> {
    this.configureExpress();
    this.createServer();
    await this.startDBsConnections();
    this.startServer();
  }

  public async stopServer(message = '') {
    console.log(message);
    await this.mongoClient.closeDBConnection();
    process.exit();
  }

  public forceStopServer(message = ''){
    console.log(message);
    this.mongoClient.forceCloseDBConnection();
    process.exit(1);
  }

  public logErrorAndTerminate(error: string){
    console.log(error);
    this.stopServer();
  }
}

export { Server };
