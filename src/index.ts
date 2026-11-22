import { Server } from './presentation/rest/server';
import { SIGS_SERVER_EXIT } from './infrastructure/shared/config';

const server = new Server();

process
  .on(SIGS_SERVER_EXIT.SIGINT, () => server.stopServer('SIGINT received, shutting down'))
  .on(SIGS_SERVER_EXIT.SIGTERM, () => server.stopServer('SIGTERM received, shutting down'))
  .on(SIGS_SERVER_EXIT.SIGBREAK, () => server.forceStopServer('SIGBREAK received, forcing shutdown'))
  .on('unhandledRejection', (error) => server.logErrorAndTerminate('Unhandled promise rejection', error))
  .on('uncaughtException', (error) => server.logErrorAndTerminate('Uncaught exception', error));

server.exec().catch((error) => server.logErrorAndTerminate('Failed to start the server', error));
