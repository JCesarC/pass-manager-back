import dotenv from 'dotenv';
dotenv.config();

import { Server } from './presentation/rest/server';
import { startDBConnection } from './infrastructure/persistance/mongoose';

const start = async () => {
  const server = new Server();
  await startDBConnection();
  server.exec();

  process
    .on('SIGINT', () => {
      server.stopServer();
    })
    .on('unhandledRejection', (error) => {
      server.logErrorAndTerminate(`unhandledRejection captured: ${error}`);
    })
    .on('uncaughtException', (error) => {
      server.logErrorAndTerminate(`uncaughtException captured: ${error}`);
    });
};

start();
