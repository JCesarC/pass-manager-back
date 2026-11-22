import pino from 'pino';

import { env } from '../config';

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

const isInstalled = (moduleName: string) => {
  try {
    require.resolve(moduleName);
    return true;
  } catch {
    return false;
  }
};

const usePrettyOutput = env.NODE_ENV === 'development' && isInstalled('pino-pretty');

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'pass-manager-api' },
  redact: { paths: REDACTED_PATHS, censor: '[REDACTED]' },
  ...(usePrettyOutput && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname,service' },
    },
  }),
});
