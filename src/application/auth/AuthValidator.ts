import Joi from 'joi';

import { IAuthCredentials } from '../../domain/auth/interfaces';

const loginValidator = Joi.object<IAuthCredentials>({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export { loginValidator };
