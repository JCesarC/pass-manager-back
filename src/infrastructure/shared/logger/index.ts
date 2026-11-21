import pino from 'pino';

import { env } from '../config';

/**
 * Paths removed from every log line. Request bodies are never logged, but
 * these also cover objects passed explicitly to the logger.
 */
export const REDACTED_PATHS = [
  'req.headers.authorization',
  'req.headers.cookie',
  'res.headers["set-cookie"]',
  ...['password', 'token', 'accessToken', 'refreshToken', 'code', 'secret'].flatMap((key) => [
    key,
    `*.${key}`,
    `*.*.${key}`,
  ]),
];

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'pass-manager-api' },
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  ...(env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname,service' },
    },
  }),
});
