import mongoose, { Schema } from 'mongoose';

const noteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    urlImages: {
      type: [],
      required: false
    }
  }
);

export const NoteModel = mongoose.model('Notes', noteSchema);
