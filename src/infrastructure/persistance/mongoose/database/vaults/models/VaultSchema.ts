import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

import { IVaultModel } from '../../../../../../domain/vaults/interfaces';

const vaultSchema = new Schema<IVaultModel>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  data: { type: String, required: true },
  dataFieldType: { type: String, required: true },
  isFavorite: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  isArchived: { type: Boolean, default: false },
  expirationDate: { type: Date, default: null },
  attachments: { type: [String], default: [] },
  extraFields: { type: [Schema.Types.ObjectId], ref: 'FieldValue', autopopulate: true },
});

vaultSchema.plugin(autopopulate);

export default mongoose.model<IVaultModel>('Vault', vaultSchema);
