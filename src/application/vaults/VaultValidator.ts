import Joi from 'joi';

/** Request body to create a vault. The owner is always the authenticated user. */
export interface VaultInput {
  name: string;
  data: string;
  dataFieldType: string;
  isFavorite?: boolean;
  tags?: string[];
  isArchived?: boolean;
  expirationDate?: Date | null;
}

/** Request body to update a vault: any subset of the editable fields. */
export interface VaultUpdateInput {
  name?: string;
  data?: string;
  dataFieldType?: string;
  isFavorite?: boolean;
  tags?: string[];
  isArchived?: boolean;
  expirationDate?: Date | null;
}

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
const vaultValidator = Joi.object<VaultInput>({
  ...vaultFields,
  name: vaultFields.name.required(),
  data: vaultFields.data.required(),
  dataFieldType: vaultFields.dataFieldType.required(),
});

const vaultUpdateValidator = Joi.object<VaultUpdateInput>(vaultFields).min(1);

export { vaultUpdateValidator, vaultValidator };
