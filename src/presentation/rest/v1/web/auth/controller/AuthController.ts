import { Body, Inject, Post, Route, Tags } from 'tsoa';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';

import { LoginUserUseCase, RegisterUserUseCase } from '../../../../../../application/auth/UseCases';
import {
  CreateUserUseCase,
  GetUserByEmailUseCase,
} from '../../../../../../application/users/UseCases';
import { AuthService } from '../../../../../../application/auth/services/AuthService';
import { TokenService } from '../../../../../../application/auth/services/TokenService';
import { loginValidator, RegisterUserInput, registerUserValidator } from '../../../../../../application/auth/AuthValidator';
import { NotFoundError, validate } from '../../../../../../application/shared';

@Route('/api/v1/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService;
  private userRepository;

  constructor(@Inject()userRepository: IUserRepository){
    this.authService = new AuthService();
    this.userRepository = userRepository;
  }

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

  @Post('/login')
  async loginUser(@Body()authCredentials: IAuthCredentials): Promise<unknown> {
    const loginUserUseCase = new LoginUserUseCase(this.userRepository);

    const credentials = validate(loginValidator, authCredentials);
    return loginUserUseCase.execute(credentials);
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

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

}
