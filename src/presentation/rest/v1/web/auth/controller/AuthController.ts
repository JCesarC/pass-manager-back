import { Body, Inject, Post, Route, Tags } from 'tsoa';

import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';
import { IRefreshTokenRepository } from '../../../../../../domain/auth/repository/IRefreshTokenRepository';
import { IOAuthCodeRepository } from '../../../../../../domain/auth/repository/IOAuthCodeRepository';

import {
  ExchangeOAuthCodeUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshSessionUseCase,
  RegisterUserUseCase,
} from '../../../../../../application/auth/UseCases';
import { loginValidator, oauthExchangeValidator, RegisterUserInput, registerUserValidator } from '../../../../../../application/auth/AuthValidator';
import { UnauthorizedError, validate } from '../../../../../../application/shared';

@Route('/api/v1/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {
  constructor(
    @Inject() private readonly userRepository: IUserRepository,
    @Inject() private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject() private readonly oauthCodeRepository: IOAuthCodeRepository,
  ) {}

  @Post('/register')
  async registerUser(@Body()user: RegisterUserInput): Promise<unknown> {
    const registerUserUseCase = new RegisterUserUseCase(this.userRepository);

    const newUser = validate(registerUserValidator, user);
    return registerUserUseCase.execute({
      ...newUser,
      displayName: newUser.displayName || newUser.firstName,
      active: false,
    });
  }

  /**
   * Returns a short-lived access token in the body. The refresh token is
   * only sent as an httpOnly cookie scoped to /api/v1/auth.
   */
  @Post('/login')
  async loginUser(@Body()authCredentials: IAuthCredentials) {
    const loginUserUseCase = new LoginUserUseCase(this.userRepository, this.refreshTokenRepository);

    const credentials = validate(loginValidator, authCredentials);
    return loginUserUseCase.execute(credentials);
  }

  /** Rotates the refresh token cookie and returns a new access token. */
  @Post('/refresh')
  async refreshSession(@Inject() refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedError('The session is invalid. Please sign in again.');
    return new RefreshSessionUseCase(this.refreshTokenRepository).execute(refreshToken);
  }

  /**
   * Completes a Google sign-in: exchanges the single-use code received by
   * the front end for a session (same response as login).
   */
  @Post('/oauth/exchange')
  async exchangeOAuthCode(@Body() body: { code: string }) {
    const { code } = validate(oauthExchangeValidator, body);
    return new ExchangeOAuthCodeUseCase(
      this.userRepository,
      this.oauthCodeRepository,
      this.refreshTokenRepository,
    ).execute(code);
  }

  /** Revokes the current session and clears the refresh token cookie. */
  @Post('/logout')
  async logoutUser(@Inject() refreshToken: string | undefined): Promise<void> {
    await new LogoutUserUseCase(this.refreshTokenRepository).execute(refreshToken);
  }

}
