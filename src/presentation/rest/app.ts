import express, { Express } from 'express';

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import { AppConfig } from './config';
import { env } from '../../infrastructure/shared/config';
import mainRouter from './router';
import { createRateLimiter, errorHandler, notFoundHandler, RateLimitOptions, requestLogger } from './middlewares';

import passportConfig from '../../infrastructure/authentication/passport/passportConfig';

import swaggerDoc from '../../../public/swagger.json';

export interface AppOptions {
  rateLimits?: { auth?: RateLimitOptions; api?: RateLimitOptions };
}

export const createApp = (options: AppOptions = {}): Express => {
  const app = express();
  const windowMinutes = env.RATE_LIMIT_WINDOW_MINUTES;

  if (env.USE_PROXY) app.set('trust proxy', 1);

  app.use(requestLogger);
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
  app.use(express.json({ limit: AppConfig.JSON_BODY_LIMIT }));
  app.use(cookieParser());
  app.use(compression());
  app.use(passportConfig.initialize());
  app.use(AppConfig.DOCS_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
  app.use(
    `${AppConfig.BASE_PATH}/auth`,
    createRateLimiter(options.rateLimits?.auth ?? { windowMinutes, max: env.AUTH_RATE_LIMIT_MAX }),
  );
  app.use('/api', createRateLimiter(options.rateLimits?.api ?? { windowMinutes, max: env.API_RATE_LIMIT_MAX }));
  app.use('/api', mainRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
