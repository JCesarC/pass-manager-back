import Joi from 'joi';

import { IFieldValueModel } from '../../domain/fieldValues/interfaces';

const fieldValueValidator = Joi.object<IFieldValueModel>({
  field: Joi.string().hex().length(24).required(),
  value: Joi.alternatives().try(Joi.string().max(10_000), Joi.array().items(Joi.string().max(10_000)).max(50)).required(),
  vault: Joi.string().hex().length(24).required(),
});

export { fieldValueValidator };
