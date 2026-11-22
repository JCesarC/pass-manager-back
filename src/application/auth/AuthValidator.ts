import Joi from 'joi';

import { IAuthCredentials } from '../../domain/auth/interfaces';

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  displayName?: string;
}

const registerUserValidator = Joi.object<RegisterUserInput>({
  firstName: Joi.string().trim().min(1).max(50).required(),
  lastName: Joi.string().trim().min(1).max(50).required(),
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(8).max(72).required(),
  displayName: Joi.string().trim().min(1).max(50),
});

const loginValidator = Joi.object<IAuthCredentials>({
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().max(72).required(),
});

const oauthExchangeValidator = Joi.object<{ code: string }>({
  code: Joi.string().pattern(/^[\w-]{20,100}$/).required(),
});

export { loginValidator, oauthExchangeValidator, registerUserValidator };
