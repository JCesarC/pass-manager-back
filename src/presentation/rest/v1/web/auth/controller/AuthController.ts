import { Body, Example, Inject, OperationId, Post, Response, Route, SuccessResponse, Tags } from 'tsoa';

import { IAuthCredentials } from '../../../../../../domain/auth/interfaces';
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
import {
  loginValidator,
  oauthExchangeValidator,
  RegisterUserInput,
  registerUserValidator,
} from '../../../../../../application/auth/AuthValidator';
import { NotFoundError, UnauthorizedError, validate } from '../../../../../../application/shared';
import { IUserResponseModel } from '../../../../../../domain/users/interfaces';

import {
  AccessTokenResponse,
  ErrorResponseBody,
  OAuthExchangeInput,
  presentUser,
  SessionResponse,
  UserResponse,
  RefreshTokenSink,
} from '../../../contracts';

const toProfile = (user: IUserResponseModel | null) => {
  if (!user) throw new NotFoundError('User');
  return presentUser(user);
};

@Route('/api/v1/auth')
@Tags('Auth')
@Response<ErrorResponseBody>(429, 'Too many requests from this IP', {
  error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
})
export class AuthController {
  constructor(
    @Inject() private readonly userRepository: IUserRepository,
    @Inject() private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject() private readonly oauthCodeRepository: IOAuthCodeRepository,
  ) {}

  /**
   * @summary Create an account
   */
  @Post('/register')
  @OperationId('register')
  @SuccessResponse(201, 'Account created')
  @Example<UserResponse>({
    user: {
      _id: '6650f1a2b3c4d5e6f7a8b9c0',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      displayName: 'Jane',
      roles: [],
      active: false,
      verified: false,
    },
  })
  @Response<ErrorResponseBody>(400, 'Invalid or unknown fields', {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'The request is invalid.',
      details: [{ path: 'password', message: '"password" length must be at least 8 characters long' }],
    },
  })
  @Response<ErrorResponseBody>(409, 'Email already registered', {
    error: { code: 'CONFLICT', message: 'This email is already registered.' },
  })
  async registerUser(@Body() user: RegisterUserInput): Promise<UserResponse> {
    const newUser = validate(registerUserValidator, user);
    const { user: created } = await new RegisterUserUseCase(this.userRepository).execute({
      ...newUser,
      displayName: newUser.displayName || newUser.firstName,
      active: false,
    });
    return { user: toProfile(created) };
  }

  /**
   * @summary Sign in with email and password
   */
  @Post('/login')
  @OperationId('login')
  @SuccessResponse(200, 'Signed in. The refresh token is set as an HttpOnly cookie scoped to /api/v1/auth')
  @Example<SessionResponse>({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    tokenType: 'Bearer',
    expiresIn: 900,
    user: {
      _id: '6650f1a2b3c4d5e6f7a8b9c0',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      roles: [],
      active: false,
      verified: false,
    },
  })
  @Response<ErrorResponseBody>(401, 'Wrong credentials or temporarily locked account', {
    error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
  })
  async loginUser(
    @Body() authCredentials: IAuthCredentials,
    @Inject() sendRefreshToken: RefreshTokenSink,
  ): Promise<SessionResponse> {
    const credentials = validate(loginValidator, authCredentials);
    const { user, refreshToken, ...session } = await new LoginUserUseCase(
      this.userRepository,
      this.refreshTokenRepository,
    ).execute(credentials);
    sendRefreshToken(refreshToken);
    return { ...session, user: toProfile(user) };
  }

  /**
   * @summary Get a new access token
   */
  @Post('/refresh')
  @OperationId('refreshSession')
  @SuccessResponse(200, 'New access token. The refresh token cookie is rotated')
  @Example<AccessTokenResponse>({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    tokenType: 'Bearer',
    expiresIn: 900,
  })
  @Response<ErrorResponseBody>(401, 'Missing, expired, revoked or reused refresh token', {
    error: { code: 'UNAUTHORIZED', message: 'The session is invalid. Please sign in again.' },
  })
  async refreshSession(
    @Inject() currentRefreshToken: string | undefined,
    @Inject() sendRefreshToken: RefreshTokenSink,
  ): Promise<AccessTokenResponse> {
    if (!currentRefreshToken) throw new UnauthorizedError('The session is invalid. Please sign in again.');
    const { refreshToken, ...session } = await new RefreshSessionUseCase(
      this.refreshTokenRepository,
    ).execute(currentRefreshToken);
    sendRefreshToken(refreshToken);
    return session;
  }

  /**
   * @summary Complete a Google sign-in
   */
  @Post('/oauth/exchange')
  @OperationId('exchangeOAuthCode')
  @SuccessResponse(200, 'Signed in. Same response as login')
  @Response<ErrorResponseBody>(401, 'Invalid, expired or already used code', {
    error: { code: 'UNAUTHORIZED', message: 'The sign-in code is invalid or has expired.' },
  })
  async exchangeOAuthCode(
    @Body() body: OAuthExchangeInput,
    @Inject() sendRefreshToken: RefreshTokenSink,
  ): Promise<SessionResponse> {
    const { code } = validate(oauthExchangeValidator, body);
    const { user, refreshToken, ...session } = await new ExchangeOAuthCodeUseCase(
      this.userRepository,
      this.oauthCodeRepository,
      this.refreshTokenRepository,
    ).execute(code);
    sendRefreshToken(refreshToken);
    return { ...session, user: toProfile(user) };
  }

  /**
   * @summary Sign out
   */
  @Post('/logout')
  @OperationId('logout')
  @SuccessResponse(204, 'Session revoked and refresh token cookie cleared')
  async logoutUser(@Inject() refreshToken: string | undefined): Promise<void> {
    await new LogoutUserUseCase(this.refreshTokenRepository).execute(refreshToken);
  }
}
