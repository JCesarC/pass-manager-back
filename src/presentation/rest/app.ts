import express, { Express } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { AppConfig } from './config';
import { env } from '../../infrastructure/shared/config';
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

  // Needed for correct client IPs (rate limiting, logs) behind a reverse proxy.
  if (env.USE_PROXY) app.set('trust proxy', 1);

  app.use(requestLogger);
  app.use(helmet());
  // Only the configured front-end origins may call the API from a browser,
  // and they may send credentials (the refresh-token cookie).
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
  // The API only accepts JSON. Vault items are small; anything larger is rejected.
  app.use(express.json({ limit: AppConfig.JSON_BODY_LIMIT }));
  app.use(cookieParser());
  app.use(compression());
  app.use(passportConfig.initialize());
  app.use(AppConfig.DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
  app.use('/api', mainRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
