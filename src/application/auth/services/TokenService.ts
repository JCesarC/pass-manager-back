import jwt, { JwtPayload } from 'jsonwebtoken';

import { env } from '../../../infrastructure/shared/config';
import { UnauthorizedError } from '../../shared';

const ALGORITHM = 'HS256';
const ISSUER = 'pass-manager-api';
const AUDIENCE = 'pass-manager';

export interface AccessTokenClaims {
  userId: string;
}

export interface IssuedAccessToken {
  accessToken: string;
  tokenType: 'Bearer';
  /** Lifetime in seconds. */
  expiresIn: number;
}

/**
 * Issues and verifies access tokens (JWT). The algorithm, issuer and
 * audience are pinned on verification so tokens signed differently or for
 * another service are rejected.
 */
export class TokenService {
  /** Access tokens are short-lived; sessions are extended with refresh tokens. */
  get accessTokenTtlSeconds(): number {
    return env.ACCESS_TOKEN_TTL_MINUTES * 60;
  }

  signAccessToken(userId: string): string {
    return jwt.sign({}, env.JWT_SECRET, {
      algorithm: ALGORITHM,
      subject: userId,
      issuer: ISSUER,
      audience: AUDIENCE,
      expiresIn: this.accessTokenTtlSeconds,
    });
  }

  issueAccessToken(userId: string): IssuedAccessToken {
    return {
      accessToken: this.signAccessToken(userId),
      tokenType: 'Bearer',
      expiresIn: this.accessTokenTtlSeconds,
    };
  }

  verifyAccessToken(token: string): AccessTokenClaims {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET, {
        algorithms: [ALGORITHM],
        issuer: ISSUER,
        audience: AUDIENCE,
      }) as JwtPayload;

      if (!payload.sub) throw new Error('Missing subject');
      return { userId: payload.sub };
    } catch {
      throw new UnauthorizedError('The access token is invalid or has expired.');
    }
  }
}
