import mongoose, { Schema } from 'mongoose';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import RolesSchema from '../../roles/models/RolesSchema';

const userSchema: Schema = new Schema<IUserModel>(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: RolesSchema,
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
    }
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUserModel>('User', userSchema);
