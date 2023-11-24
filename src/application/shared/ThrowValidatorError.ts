import Joi from 'joi';

export const ThrowValidatorError = (error: Joi.ValidationError) => {
  throw new Error(error.details[0].message);
};
