import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { RefreshTokenService } from '../services/RefreshTokenService';
import { TokenService } from '../services/TokenService';

/** Exchanges a refresh token for a new access token and a rotated refresh token. */
export class RefreshSessionUseCase {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(refreshToken: string) {
    const rotated = await new RefreshTokenService(this.refreshTokenRepository).rotate(refreshToken);

    return {
      ...new TokenService().issueAccessToken(rotated.userId),
      refreshToken: { token: rotated.token, expiresAt: rotated.expiresAt },
    };
  }
}
