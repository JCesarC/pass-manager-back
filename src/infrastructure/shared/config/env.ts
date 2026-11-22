import dotenv from 'dotenv';
import Joi from 'joi';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

export interface Env {
  NODE_ENV: 'development' | 'test' | 'production';
  LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_TTL_MINUTES: number;
  REFRESH_TOKEN_TTL_DAYS: number;
  COOKIE_SECURE: boolean;
  COOKIE_SAME_SITE: 'strict' | 'lax' | 'none';
  RATE_LIMIT_WINDOW_MINUTES: number;
  AUTH_RATE_LIMIT_MAX: number;
  API_RATE_LIMIT_MAX: number;
  LOGIN_MAX_FAILED_ATTEMPTS: number;
  LOGIN_LOCKOUT_MINUTES: number;
  USE_PROXY: boolean;
  FRONTEND_URL: string;
  CORS_ORIGINS: string[];
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

type RawEnv = Omit<Env, 'CORS_ORIGINS'> & { CORS_ORIGINS: string };

const optionalString = Joi.string().allow('').default('');

const envSchema = Joi.object<RawEnv>({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  LOG_LEVEL: Joi.string()
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
    .when('NODE_ENV', { is: 'test', then: Joi.optional().default('silent'), otherwise: Joi.optional().default('info') }),
  PORT: Joi.number().port().default(3000),
  MONGODB_URL: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required()
    .messages({ 'string.pattern.base': '"MONGODB_URL" must start with mongodb:// or mongodb+srv://' }),
  JWT_SECRET: Joi.string().min(32).required(),
  ACCESS_TOKEN_TTL_MINUTES: Joi.number().integer().min(1).max(60).default(15),
  REFRESH_TOKEN_TTL_DAYS: Joi.number().integer().min(1).max(90).default(7),
  COOKIE_SECURE: Joi.boolean().when('NODE_ENV', {
    is: 'production',
    then: Joi.optional().default(true),
    otherwise: Joi.optional().default(false),
  }),
  COOKIE_SAME_SITE: Joi.string().valid('strict', 'lax', 'none').default('strict'),
  RATE_LIMIT_WINDOW_MINUTES: Joi.number().integer().min(1).default(15),
  AUTH_RATE_LIMIT_MAX: Joi.number().integer().min(1).default(20),
  API_RATE_LIMIT_MAX: Joi.number().integer().min(1).default(300),
  LOGIN_MAX_FAILED_ATTEMPTS: Joi.number().integer().min(1).default(5),
  LOGIN_LOCKOUT_MINUTES: Joi.number().integer().min(1).default(15),
  USE_PROXY: Joi.boolean().default(false),
  FRONTEND_URL: Joi.string().uri({ scheme: ['http', 'https'] }).default('http://localhost:5173'),
  CORS_ORIGINS: Joi.string().allow('').default(''),
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
}).unknown(true);

const loadEnv = (): Env => {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false, convert: true });

  if (!error && value.COOKIE_SAME_SITE === 'none' && !value.COOKIE_SECURE) {
    throw new Error('Invalid environment configuration:\n  - COOKIE_SAME_SITE=none requires COOKIE_SECURE=true');
  }

  if (error) {
    const problems = error.details.map((detail) => `  - ${detail.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  const raw = value as RawEnv;
  const corsOrigins = raw.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);

  return Object.freeze({
    ...raw,
    CORS_ORIGINS: corsOrigins.length > 0 ? corsOrigins : [raw.FRONTEND_URL],
  });
};

export const env = loadEnv();

export const isGoogleAuthEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
