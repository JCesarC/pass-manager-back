import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { RefreshTokenService } from '../services/RefreshTokenService';

export class LogoutUserUseCase {
  constructor(private readonly refreshTokenRepository: IRefreshTokenRepository) {}

  async execute(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await new RefreshTokenService(this.refreshTokenRepository).revoke(refreshToken);
    }
  }
}
