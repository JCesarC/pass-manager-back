import Joi from 'joi';
import { IUserModel } from '../../domain/users/interfaces';

// Definir el esquema de validación con Joi
const userModelValidator = Joi.object<IUserModel>({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  displayName: Joi.string().required(),
  password: Joi.string().required(),
  roles: Joi.array().items(Joi.string()),
  phone: Joi.string(),
  photoURL: Joi.string(),
  provider: Joi.string(),
  active: Joi.boolean(),
  verified: Joi.boolean(),
});

export { userModelValidator };
