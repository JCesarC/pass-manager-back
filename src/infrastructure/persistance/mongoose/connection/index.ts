import mongoose from 'mongoose';

import { env } from '../../../shared/config';
import { logger } from '../../../shared/logger';

// Drop filter fields that are not in the schema (explicit; Mongoose 7+ flips the default).
mongoose.set('strictQuery', true);

mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

mongoose.connection.on('close', () => {
  logger.info('MongoDB connection closed');
});

export const startDBConnection = async () => {
  await mongoose.connect(env.MONGODB_URL);
};

export const closeDBConnection = async () => {
  await mongoose.connection.close();
};

export const forceCloseDBConnection = () => {
  mongoose.connection.close(true);
};
