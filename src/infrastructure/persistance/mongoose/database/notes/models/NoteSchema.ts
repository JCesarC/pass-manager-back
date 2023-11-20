import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

import { INoteModel } from '../../../../../../domain/notes/interfaces';

const noteSchema = new Schema<INoteModel>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  data: { type: String, required: false },
  isFavorite: { type: Boolean, required: false, default: false },
  isArchived: { type: Boolean, default: false },
  tags: { type: [String], required: false, default: [] },
});

noteSchema.plugin(autopopulate);

export default mongoose.model<INoteModel>('Note', noteSchema);
