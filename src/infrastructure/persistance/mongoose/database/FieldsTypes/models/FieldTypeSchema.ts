import mongoose, { Schema } from 'mongoose';

import { IFieldTypeModel } from '../../../../../../domain/fields/interfaces';

const FieldTypeSchema = new Schema<IFieldTypeModel>({
  name: {
    type: Schema.Types.String,
    required: true,
  }
});

export default mongoose.model<IFieldTypeModel>('FieldType', FieldTypeSchema);
