import mongoose, { Schema, SchemaTypes } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    password: {
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
      required: false,
      default: false
    },
    displayName: {
      type: String,
      required: false
    },
    photoURL: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model('Users', userSchema);
