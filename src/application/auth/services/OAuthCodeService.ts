import { createHash, randomBytes } from 'crypto';

import { IOAuthCodeRepository } from '../../../domain/auth/repository/IOAuthCodeRepository';
import { UnauthorizedError } from '../../shared';

const CODE_TTL_MS = 60_000;

const hash = (code: string) => createHash('sha256').update(code).digest('hex');

export class OAuthCodeService {
  constructor(private readonly repository: IOAuthCodeRepository) {}

  async issue(userId: string): Promise<string> {
    const code = randomBytes(32).toString('base64url');
    await this.repository.create({
      codeHash: hash(code),
      userId,
      expiresAt: new Date(Date.now() + CODE_TTL_MS),
    });
    return code;
  }

  async consume(code: string): Promise<string> {
    const userId = await this.repository.consume(hash(code));
    if (!userId) throw new UnauthorizedError('The sign-in code is invalid or has expired.');
    return userId;
  }
}
