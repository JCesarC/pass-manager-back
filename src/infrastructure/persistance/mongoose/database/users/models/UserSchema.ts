import mongoose, { Schema } from 'mongoose';
import { IUserModel } from '../../../../../../domain/users/interfaces';

const userSchema: Schema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
      type: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
      default: []
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
      required: false,
      default: ''
    },
    provider: {
      type: String,
      required: false
    },
    verified: {
      type: Boolean,
      required: false,
      default: false
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUserModel>('User', userSchema);
