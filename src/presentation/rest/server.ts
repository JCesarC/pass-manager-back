import http, { Server as ServerInstance } from 'http';

import { AppInfo, AppConfig } from './config';
import { createApp } from './app';
import { env } from '../../infrastructure/shared/config';

import { closeDBConnection, forceCloseDBConnection, startDBConnection } from '../../infrastructure/persistance/mongoose/connection';

class Server {
  private httpServer!: ServerInstance;

  private showBanner(): void {
    const banner = `
      Application started successfully!
      Name: ${AppInfo.APP_NAME}
      Environment: ${env.NODE_ENV}
      Port: ${env.PORT}
      BasePath: ${AppConfig.BASE_PATH}
      OpenApi Spec Path: ${AppConfig.DOCS_PATH}
    `;
    console.log(banner);
  }

  private async startServer(): Promise<void> {
    await startDBConnection();
    this.httpServer = http.createServer(createApp());
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
