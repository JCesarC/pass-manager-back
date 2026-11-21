import { IRefreshToken } from '../interfaces';

export interface IRefreshTokenRepository {
  create(token: IRefreshToken): Promise<void>;
  findByHash(tokenHash: string): Promise<IRefreshToken | null>;
  /**
   * Atomically revokes a token that is still active. Returns false when it
   * was already revoked, which means it is being used twice.
   */
  revokeIfActive(tokenHash: string, replacedByHash: string | null): Promise<boolean>;
  revokeFamily(familyId: string): Promise<void>;
}
