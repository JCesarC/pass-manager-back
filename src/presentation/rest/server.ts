import http, { Server as ServerInstance } from 'http';

import { AppInfo, AppConfig } from './config';
import { createApp } from './app';
import { env } from '../../infrastructure/shared/config';
import { logger } from '../../infrastructure/shared/logger';

import { closeDBConnection, forceCloseDBConnection, startDBConnection } from '../../infrastructure/persistance/mongoose/connection';

class Server {
  private httpServer?: ServerInstance;

  private async startServer(): Promise<void> {
    await startDBConnection();
    this.httpServer = http.createServer(createApp());
    this.httpServer.listen(env.PORT, () => {
      logger.info(
        {
          name: AppInfo.APP_NAME,
          environment: env.NODE_ENV,
          port: env.PORT,
          basePath: AppConfig.BASE_PATH,
          docsPath: AppConfig.DOCS_PATH,
        },
        'Server started',
      );
    });
  }

  public async exec(): Promise<void> {
    await this.startServer();
  }

  public async stopServer(message = 'Shutting down the server', exitCode = 0) {
    logger.info(message);
    await new Promise<void>((resolve) => {
      if (!this.httpServer?.listening) return resolve();
      this.httpServer.close(() => resolve());
    });
    await closeDBConnection();
    process.exit(exitCode);
  }

  public forceStopServer(message = 'Forcing server shutdown') {
    logger.warn(message);
    forceCloseDBConnection();
    process.exit(1);
  }

  public async logErrorAndTerminate(context: string, error: unknown) {
    logger.fatal({ err: error }, context);
    await this.stopServer('Shutting down the server after a fatal error', 1);
  }
}

export { Server };
