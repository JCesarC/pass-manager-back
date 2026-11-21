import mongoose, { Schema } from 'mongoose';

import { IRefreshToken } from '../../../../../../domain/auth/interfaces';

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    familyId: { type: String, required: true, index: true },
    // MongoDB removes expired tokens automatically (TTL index).
    expiresAt: { type: Date, required: true, expires: 0 },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
