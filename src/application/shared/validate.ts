import Joi from 'joi';

import { ValidationError } from './errors';

/**
 * Validates a payload against a Joi schema and returns the sanitized value.
 * Every problem is reported (not only the first one) and unknown keys are
 * rejected unless the schema explicitly allows them.
 */
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
