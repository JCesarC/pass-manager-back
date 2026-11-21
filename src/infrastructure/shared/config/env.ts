import dotenv from 'dotenv';
import Joi from 'joi';

// Tests configure the environment themselves and must not pick up a developer's .env.
if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

/**
 * Single source of truth for runtime configuration.
 *
 * The environment is loaded and validated once, the first time this module
 * is imported. Missing or malformed variables stop the process at startup
 * with a list of every problem, instead of failing later at request time.
 */
export interface Env {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  MONGODB_URL: string;
  JWT_SECRET: string;
  USE_PROXY: boolean;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

const optionalString = Joi.string().allow('').default('');

const envSchema = Joi.object<Env>({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  MONGODB_URL: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\//)
    .required()
    .messages({ 'string.pattern.base': '"MONGODB_URL" must start with mongodb:// or mongodb+srv://' }),
  JWT_SECRET: Joi.string().min(32).required(),
  USE_PROXY: Joi.boolean().default(false),
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
}).unknown(true);

const loadEnv = (): Env => {
  const { error, value } = envSchema.validate(process.env, { abortEarly: false, convert: true });

  if (error) {
    const problems = error.details.map((detail) => `  - ${detail.message}`).join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  return Object.freeze(value as Env);
};

export const env = loadEnv();

export const isGoogleAuthEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
