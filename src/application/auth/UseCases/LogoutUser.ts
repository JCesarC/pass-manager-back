import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { RefreshTokenService } from '../services/RefreshTokenService';

/** Revokes the session behind a refresh token. Access tokens simply expire. */
export class LogoutUserUseCase {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await new RefreshTokenService(this.refreshTokenRepository).revoke(refreshToken);
    }
  }
}
