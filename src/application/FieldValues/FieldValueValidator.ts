import Joi from 'joi';

import { IFieldValueModel } from '../../domain/fieldValues/interfaces';

const fieldValueValidator = Joi.object<IFieldValueModel>({
  field: Joi.string().required(),
  value: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).required(),
  vault: Joi.string().required(),
});

export { fieldValueValidator };
