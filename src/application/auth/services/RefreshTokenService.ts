import { createHash, randomBytes, randomUUID } from 'crypto';

import { env } from '../../../infrastructure/shared/config';
import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { UnauthorizedError } from '../../shared';

export interface IssuedRefreshToken {
  token: string;
  expiresAt: Date;
}

export interface RotatedSession extends IssuedRefreshToken {
  userId: string;
}

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

export class RefreshTokenService {
  constructor(private readonly repository: IRefreshTokenRepository) {}

  async issue(userId: string, familyId: string = randomUUID()): Promise<IssuedRefreshToken> {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.repository.create({ userId, tokenHash: hash(token), familyId, expiresAt });
    return { token, expiresAt };
  }

  async rotate(token: string): Promise<RotatedSession> {
    const stored = await this.repository.findByHash(hash(token));
    if (!stored) throw new UnauthorizedError('The session is invalid. Please sign in again.');

    if (stored.revokedAt) {
      await this.repository.revokeFamily(stored.familyId);
      throw new UnauthorizedError('The session is invalid. Please sign in again.');
    }

    if (stored.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedError('The session has expired. Please sign in again.');
    }

    const next = randomBytes(32).toString('base64url');
    const revoked = await this.repository.revokeIfActive(stored.tokenHash, hash(next));
    if (!revoked) {
      await this.repository.revokeFamily(stored.familyId);
      throw new UnauthorizedError('The session is invalid. Please sign in again.');
    }

    const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    await this.repository.create({
      userId: stored.userId,
      tokenHash: hash(next),
      familyId: stored.familyId,
      expiresAt,
    });

    return { userId: stored.userId, token: next, expiresAt };
  }

  async revoke(token: string): Promise<void> {
    const stored = await this.repository.findByHash(hash(token));
    if (stored) await this.repository.revokeFamily(stored.familyId);
  }
}
