import Joi from 'joi';

export const ThrowValidatorError = (error: Joi.ValidationError, res: any) => {
  return res.status(400).send({
    error: true,
    errorMessage: error.details[0].message,
  });
};
