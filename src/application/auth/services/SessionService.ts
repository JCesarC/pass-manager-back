import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { RefreshTokenService } from './RefreshTokenService';
import { TokenService } from './TokenService';

export class SessionService {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async start(userId: string) {
    return {
      ...new TokenService().issueAccessToken(userId),
      refreshToken: await new RefreshTokenService(this.refreshTokenRepository).issue(userId),
    };
  }
}
