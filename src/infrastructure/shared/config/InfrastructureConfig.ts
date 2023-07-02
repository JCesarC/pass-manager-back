import { getEnnvironmentNumber, getEnvironmentString } from './environment';

const GlobalConfig = Object.freeze({
  ENVIRONMENT: getEnvironmentString('NODE_ENV', 'development'),
  IS_TEST: getEnvironmentString('NODE_ENV', 'development') === 'test',
  IS_DEVELOPMENT: getEnvironmentString('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvironmentString('NODE_ENV', 'development') === 'production',
  JWT_SECRET: getEnvironmentString('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnnvironmentNumber('JWT_EXPIRATION', 1),
  LOGS_ENABLED: getEnvironmentString('LOGS_ENABLED', 'true') === 'true',
  LOGS_FOLDER: getEnvironmentString('LOGS_FOLDER', 'logs'),
  PINO_LOGGER_KEY: 'pino-logger'
});

export { GlobalConfig };
