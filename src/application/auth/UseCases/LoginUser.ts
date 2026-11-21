import { GetFilteredUserDataUseCase, GetUserByEmailUseCase } from '../../users/UseCases';
import { AuthService } from '../services/AuthService';
import { TokenService } from '../services/TokenService';
import { RefreshTokenService } from '../services/RefreshTokenService';

import { IAuthCredentials } from '../../../domain/auth/interfaces';
import { IRefreshTokenRepository } from '../../../domain/auth/repository/IRefreshTokenRepository';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

import { USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';
import { InvalidCredentialsError } from '../../shared';

export class LoginUserUseCase {
  private readonly authService = new AuthService();
  private readonly tokenService = new TokenService();

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

    // Accounts created through Google have no password and cannot sign in with one.
    if (!userFound.password) throw new InvalidCredentialsError();

    const validPassword = this.authService.comparePassword(password, userFound.password);
    if (!validPassword) throw new InvalidCredentialsError();

    const userId = userFound._id.toString();
    const userData = await getFilteredUserDataUseCase.execute(userId);
    const refreshToken = await new RefreshTokenService(this.refreshTokenRepository).issue(userId);

    return {
      user: userData,
      ...this.tokenService.issueAccessToken(userId),
      refreshToken,
    };
  }
}
