import express, { Express } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

import { AppConfig } from './config';
import mainRouter from './router';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares';

import passportConfig from '../../infrastructure/authentication/passport/passportConfig';

import swaggerDoc from '../../../public/swagger.json';

/**
 * Builds the Express application without binding it to a port or opening a
 * database connection, so it can be reused by the HTTP server and by tests.
 */
export const createApp = (): Express => {
  const app = express();

  app.use(requestLogger);
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(compression());
  app.use(passportConfig.initialize());
  app.use(AppConfig.DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
  app.use('/api', mainRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
