import { Server } from './presentation/rest/server';
import { SIGS_SERVER_EXIT } from './infrastructure/shared/config';

const server = new Server();
const start = async () => {

  process
    .on(SIGS_SERVER_EXIT.SIGINT, async () => {
      await server.stopServer('Shutting down the server...');
    })
    .on(SIGS_SERVER_EXIT.SIGBREAK, async () => {
      await server.stopServer('Forcing server shutdown...');
    })
    .on(SIGS_SERVER_EXIT.SIGTERM, () => {
      // server.stopServer('Shutting down the server...');
      server.stopServer('Forcing server shutdown...');
    })
    .on('unhandledRejection', (error) => {
      server.logErrorAndTerminate(`unhandledRejection captured: ${error}`);
    })
    .on('uncaughtException', (error) => {
      server.logErrorAndTerminate(`uncaughtException captured: ${error}`);
    });

  await server.exec();
};

start();
