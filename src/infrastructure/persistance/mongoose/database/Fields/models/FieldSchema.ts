import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

import { IFieldModel } from '../../../../../../domain/fields/interfaces';

const FieldSchema = new Schema<IFieldModel>({
  name: {
    type: Schema.Types.String,
    required: true,
    unique: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'FieldType',
    required: true,
  }
});

FieldSchema.plugin(autopopulate);

export default mongoose.model<IFieldModel>('Field', FieldSchema);
