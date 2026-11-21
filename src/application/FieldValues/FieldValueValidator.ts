import Joi from 'joi';

/** Request body to add a field value to one of the caller's vaults. */
export interface FieldValueInput {
  /** Id of the field definition. */
  field: string;
  value: string | string[];
  /** Id of a vault owned by the caller. */
  vault: string;
}

const fieldValueValidator = Joi.object<FieldValueInput>({
  field: Joi.string().hex().length(24).required(),
  value: Joi.alternatives().try(Joi.string().max(10_000), Joi.array().items(Joi.string().max(10_000)).max(50)).required(),
  vault: Joi.string().hex().length(24).required(),
});

export { fieldValueValidator };
