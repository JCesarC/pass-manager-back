import { Body, Inject, Post, Route, Tags } from 'tsoa';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';
import { IRefreshTokenRepository } from '../../../../../../domain/auth/repository/IRefreshTokenRepository';

import {
  LoginUserUseCase,
  LogoutUserUseCase,
  RefreshSessionUseCase,
  RegisterUserUseCase,
} from '../../../../../../application/auth/UseCases';
import {
  CreateUserUseCase,
  GetUserByEmailUseCase,
} from '../../../../../../application/users/UseCases';
import { AuthService } from '../../../../../../application/auth/services/AuthService';
import { TokenService } from '../../../../../../application/auth/services/TokenService';
import { loginValidator, RegisterUserInput, registerUserValidator } from '../../../../../../application/auth/AuthValidator';
import { NotFoundError, UnauthorizedError, validate } from '../../../../../../application/shared';

@Route('/api/v1/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService = new AuthService();

  constructor(
    @Inject() private readonly userRepository: IUserRepository,
    @Inject() private readonly refreshTokenRepository: IRefreshTokenRepository,
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

  /** Revokes the current session and clears the refresh token cookie. */
  @Post('/logout')
  async logoutUser(@Inject() refreshToken: string | undefined): Promise<void> {
    await new LogoutUserUseCase(this.refreshTokenRepository).execute(refreshToken);
  }

  async signInByGoogle(user: IGoogleProfile): Promise<unknown> {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);
    const createUserUseCase = new CreateUserUseCase(this.userRepository);

    const { email } = user._json;

    const existingUser = await getUserByEmailUseCase.execute(email);

    // * TODO: Validate by Email and if it exists just dont create new user
    if (existingUser) return;

    const newUser: IUserModel = {
      email: user._json.email,
      firstName: user.name.givenName,
      lastName: user.name.familyName,
      active: true,
      verified: user._json.email_verified,
      displayName: user.displayName,
      photoURL: user._json.picture,
      provider: 'google',
    };

    await createUserUseCase.execute(newUser);
    return;
  }

  async generateAuthToken(email: string) {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);

    const existingUser = await getUserByEmailUseCase.execute(email);
    if (!existingUser) throw new NotFoundError('User');

    const token = new TokenService().signAccessToken(existingUser._id.toString());
    return token;
  }

}
