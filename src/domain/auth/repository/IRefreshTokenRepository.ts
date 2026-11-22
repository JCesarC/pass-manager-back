import { IRefreshToken } from '../interfaces';

export interface IRefreshTokenRepository {
  create(token: IRefreshToken): Promise<void>;
  findByHash(tokenHash: string): Promise<IRefreshToken | null>;
  revokeIfActive(tokenHash: string, replacedByHash: string | null): Promise<boolean>;
  revokeFamily(familyId: string): Promise<void>;
}
