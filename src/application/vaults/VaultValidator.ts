import Joi from 'joi';

import { IVaultModel } from '../../domain/vaults/interfaces';

const objectId = Joi.string().hex().length(24);

const vaultValidator = Joi.object<IVaultModel>({
  user: objectId.required(),
  name: Joi.string().trim().min(1).max(100).required(),
  data: Joi.string().required(),
  dataFieldType: Joi.string().required(),
  isFavorite: Joi.boolean(),
  tags: Joi.array().items(Joi.string().max(50)).max(20),
  isArchived: Joi.boolean(),
  expirationDate: Joi.date().allow(null),
  attachments: Joi.array().items(Joi.string()),
  extraFields: Joi.array().items(objectId),
});

export { vaultValidator };
