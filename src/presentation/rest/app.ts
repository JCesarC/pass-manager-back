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
  /** Per-IP limits; default to the environment configuration. */
  rateLimits?: { auth?: RateLimitOptions; api?: RateLimitOptions };
}

/**
 * Builds the Express application without binding it to a port or opening a
 * database connection, so it can be reused by the HTTP server and by tests.
 */
export const createApp = (options: AppOptions = {}): Express => {
  const app = express();
  const windowMinutes = env.RATE_LIMIT_WINDOW_MINUTES;

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
  // Brute-force protection: a strict limit on authentication endpoints and
  // a generous one for the rest of the API.
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
