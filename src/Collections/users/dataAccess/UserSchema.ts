import mongoose, { Schema, SchemaTypes } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firtName: {
      type: String,
      required: true
    },
    secondName: {
      type: String,
      required: false
    },
    lastName: {
      type: String,
      required: true
    },
    secondLastName: {
      type: String,
      required: false
    },
    roles: {
      type: [],
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    active: {
      type: Boolean,
      required: true },
    displayName: {
      type: String,
      required: true
    },
    photoURL: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model('Users', userSchema);
