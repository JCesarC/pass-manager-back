import Joi from 'joi';

import { IAuthCredentials } from '../../domain/auth/interfaces';

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Registration only accepts profile data and credentials. Account state
 * (roles, active, verified, provider) is decided by the server, never by
 * the client.
 */
const registerUserValidator = Joi.object<RegisterUserInput>({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().trim().email().max(254).required(),
  // bcrypt only uses the first 72 bytes of the input.
  password: Joi.string().min(8).max(72).required(),
  displayName: Joi.string().trim().min(1).max(50),
});

const loginValidator = Joi.object<IAuthCredentials>({
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().max(72).required(),
});

export { loginValidator, registerUserValidator };
