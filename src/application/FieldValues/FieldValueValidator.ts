import Joi from 'joi';

export interface FieldValueInput {
  field: string;
  value: string | string[];
  vault: string;
}

const fieldValueValidator = Joi.object<FieldValueInput>({
  field: Joi.string().hex().length(24).required(),
  value: Joi.alternatives().try(Joi.string().max(10_000), Joi.array().items(Joi.string().max(10_000)).max(50)).required(),
  vault: Joi.string().hex().length(24).required(),
});

export { fieldValueValidator };
