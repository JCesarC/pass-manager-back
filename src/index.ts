import dotenv from 'dotenv';
dotenv.config();

import { Server } from './presentation/rest/server';
import MongoDBClient from './infrastructure/persistance/mongoose/connection';

const mongoDBClient = new MongoDBClient();
const server = new Server(mongoDBClient);
const start = async () => {

  await server.exec();

  process
    .on('SIGINT', async () => {
      await server.stopServer('Shutting down the server...');
    })
    .on('SIGBREAK', () => {
      server.forceStopServer('Forcing server shutdown...');
    })
    .on('SIGTERM', async () => {
      await server.stopServer('Shutting down the server...');
    })
    .on('unhandledRejection', (error) => {
      server.logErrorAndTerminate(`unhandledRejection captured: ${error}`);
    })
    .on('uncaughtException', (error) => {
      server.logErrorAndTerminate(`uncaughtException captured: ${error}`);
    });
};

start();
