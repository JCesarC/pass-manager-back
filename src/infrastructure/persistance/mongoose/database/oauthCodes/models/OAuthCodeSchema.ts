import mongoose, { Schema } from 'mongoose';

import { IOAuthCode } from '../../../../../../domain/auth/interfaces';

const oauthCodeSchema = new Schema<IOAuthCode>({
  codeHash: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

export default mongoose.model<IOAuthCode>('OAuthCode', oauthCodeSchema);
