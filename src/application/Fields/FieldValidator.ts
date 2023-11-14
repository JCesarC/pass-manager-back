import Joi from 'joi';

import { IFieldModel } from '../../domain/fields/interfaces';

const fieldValidator = Joi.object<IFieldModel>({
  name: Joi.string().required(),
  type: Joi.string().required(),
});

export { fieldValidator };
