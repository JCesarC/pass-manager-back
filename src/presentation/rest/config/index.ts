// import { readPackageSync } from 'read-pkg';
import { getEnnvironmentNumber, getEnvironmentString } from '../../../infrastructure/shared/config';

const AppInfo = Object.freeze({
  APP_VERSION: getEnvironmentString('APP_VERSION', '1'),
  APP_NAME: getEnvironmentString('APP_NAME', 'Example'),
});

const AppConfig = Object.freeze({
  PORT: getEnnvironmentNumber('PORT', 8031),
  BASE_PATH: getEnvironmentString('BASE_PATH', '/api/v1'),
});

export { AppInfo, AppConfig };
