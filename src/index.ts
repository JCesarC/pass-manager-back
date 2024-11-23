import dotenv from 'dotenv';
dotenv.config();

import { Server } from './presentation/rest/server';

const start = async () => {
  const server = new Server();
  await server.exec();

  process
    .on('SIGINT', () => {
      server.stopServer('Shutting down the server...');
    })
    .on('SIGBREAK', () => {
      server.forceStopServer('Forcing server shutdown...');
    })
    .on('unhandledRejection', (error) => {
      server.logErrorAndTerminate(`unhandledRejection captured: ${error}`);
    })
    .on('uncaughtException', (error) => {
      server.logErrorAndTerminate(`uncaughtException captured: ${error}`);
    });
};

start();
