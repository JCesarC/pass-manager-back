import Joi from 'joi';

import { ValidationError } from './errors';

export const validate = <T>(schema: Joi.Schema<T>, payload: unknown): T => {
  const { error, value } = schema.validate(payload, { abortEarly: false, stripUnknown: false });

  if (error) {
    const details = error.details.map((detail) => ({
      path: detail.path.join('.'),
      message: detail.message,
    }));
    throw new ValidationError('The request is invalid.', details);
  }

  return value;
};
