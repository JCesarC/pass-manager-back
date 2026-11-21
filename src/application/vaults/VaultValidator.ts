import Joi from 'joi';

import { IVaultModel } from '../../domain/vaults/interfaces';

const vaultFields = {
  name: Joi.string().trim().min(1).max(100),
  data: Joi.string().max(10_000),
  dataFieldType: Joi.string().max(50),
  isFavorite: Joi.boolean(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(20),
  isArchived: Joi.boolean(),
  expirationDate: Joi.date().allow(null),
};

/**
 * The owner comes from the access token and extra fields are attached
 * through POST /fieldValues, so neither can be set here. Allowing
 * extraFields would let a client reference (and, through autopopulate,
 * read) another user's field values.
 */
const vaultValidator = Joi.object<Partial<IVaultModel>>({
  ...vaultFields,
  name: vaultFields.name.required(),
  data: vaultFields.data.required(),
  dataFieldType: vaultFields.dataFieldType.required(),
});

const vaultUpdateValidator = Joi.object<Partial<IVaultModel>>(vaultFields).min(1);

export { vaultUpdateValidator, vaultValidator };
