import mongoose, { Schema } from 'mongoose';
import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';
import autopopulate from 'mongoose-autopopulate';

const fieldValueSchema = new Schema<IFieldValueModel>({
  field: { type: Schema.Types.ObjectId, ref: 'Field', required: true, autopopulate: true },
  value: { type: String, required: true },
  vault: { type: String, required: true }
});

fieldValueSchema.plugin(autopopulate);

export default mongoose.model<IFieldValueModel>('FieldValue', fieldValueSchema);
