import { injectable } from 'inversify';

import { IRefreshToken } from '../../../../../../domain/auth/interfaces';
import { IRefreshTokenRepository } from '../../../../../../domain/auth/repository/IRefreshTokenRepository';
import RefreshTokenModel from '../models/RefreshTokenSchema';

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(token: IRefreshToken): Promise<void> {
    await RefreshTokenModel.create(token);
  }

  async findByHash(tokenHash: string): Promise<IRefreshToken | null> {
    return RefreshTokenModel.findOne({ tokenHash }).lean<IRefreshToken>();
  }

  async revokeIfActive(tokenHash: string, replacedByHash: string | null): Promise<boolean> {
    const result = await RefreshTokenModel.updateOne(
      { tokenHash, revokedAt: null },
      { $set: { revokedAt: new Date(), replacedByHash } },
    );
    return result.modifiedCount === 1;
  }

  async revokeFamily(familyId: string): Promise<void> {
    await RefreshTokenModel.updateMany({ familyId, revokedAt: null }, { $set: { revokedAt: new Date() } });
  }
}
