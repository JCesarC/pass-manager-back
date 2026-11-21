import { IOAuthCodeRepository } from '../../../domain/auth/repository/IOAuthCodeRepository';
import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';
import { NotFoundError } from '../../shared';
import { OAuthCodeService } from '../services/OAuthCodeService';
import { SessionService } from '../services/SessionService';

/** Turns a single-use social sign-in code into a regular session. */
export class ExchangeOAuthCodeUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly oauthCodeRepository: IOAuthCodeRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(code: string) {
    const userId = await new OAuthCodeService(this.oauthCodeRepository).consume(code);

    const user = await this.userRepository.getFilteredUserData(userId);
    if (!user) throw new NotFoundError('User');

    return {
      user,
      ...(await new SessionService(this.refreshTokenRepository).start(userId)),
    };
  }
}
