import { GetFilteredUserDataUseCase, GetUserByEmailUseCase } from '../../users/UseCases';
import { AuthService } from '../services/AuthService';
import { SessionService } from '../services/SessionService';

import { IAuthCredentials } from '../../../domain/auth/interfaces';
import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

import { USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';
import { InvalidCredentialsError } from '../../shared';
import { env } from '../../../infrastructure/shared/config';
import { logger } from '../../../infrastructure/shared/logger';

export class LoginUserUseCase {
  private readonly authService = new AuthService();

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(authCredentials: IAuthCredentials) {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(this.userRepository);

    const { email, password } = authCredentials;

    const userFound = await getUserByEmailUseCase.execute(email);
    await this.authService.validateUserExistsByEmail(
      userFound,
      email,
      USER_EXISTS_TYPES.EXIST_ON_LOGIN,
    );

    if (!userFound) throw new InvalidCredentialsError();
    const userId = userFound._id.toString();

    if (userFound.lockUntil && userFound.lockUntil.getTime() > Date.now()) {
      logger.warn({ userId }, 'Sign-in attempt on a locked account');
      throw new InvalidCredentialsError();
    }

    if (!userFound.password) throw new InvalidCredentialsError();

    const validPassword = this.authService.comparePassword(password, userFound.password);
    if (!validPassword) {
      await this.userRepository.registerFailedLogin(
        userId,
        env.LOGIN_MAX_FAILED_ATTEMPTS,
        env.LOGIN_LOCKOUT_MINUTES,
      );
      throw new InvalidCredentialsError();
    }

    await this.userRepository.resetFailedLogins(userId);
    const userData = await getFilteredUserDataUseCase.execute(userId);

    return {
      user: userData,
      ...(await new SessionService(this.refreshTokenRepository).start(userId)),
    };
  }
}
