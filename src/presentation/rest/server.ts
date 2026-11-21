import http, { Server as ServerInstance } from 'http';

import express from 'express';

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { AppInfo, AppConfig } from './config';
import { env } from '../../infrastructure/shared/config';

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
    this.app.use(AppConfig.DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDoc, this.swaggerOptions));
    this.app.use('/api', mainRouter);
    // * TODO: Add Error handling with tsoa
  }

  private showBanner(): void {
    const banner = `
      Application started successfully!
      Name: ${AppInfo.APP_NAME}
      Environment: ${env.NODE_ENV}
      Port: ${env.PORT}
      BasePath: ${AppConfig.BASE_PATH}
      OpenApi Spec Path: ${AppConfig.DOCS_PATH}
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
    this.httpServer.listen(env.PORT, () => {
      this.showBanner();
    });
  }

  public async exec(): Promise<void> {
    await this.startServer();
  }
  public async stopServer(message = '', exitCode = 0) {
    await closeDBConnection();
    console.log(message);
    process.exit(exitCode);
  }

  public forceStopServer(message = ''){
    console.log(message);
    forceCloseDBConnection();
    process.exit(1);
  }

  public async logErrorAndTerminate(error: string){
    console.error(error);
    await this.stopServer('Shutting down the server after a fatal error...', 1);
  }
}

export { Server };
