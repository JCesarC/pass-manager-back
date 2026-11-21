import { Body, Inject, Post, Route, Tags } from 'tsoa';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';

import { LoginUserUseCase, RegisterUserUseCase } from '../../../../../../application/auth/UseCases';
import {
  CreateUserUseCase,
  GetFilteredUserDataUseCase,
  GetUserByEmailUseCase,
} from '../../../../../../application/users/UseCases';
import { AuthService } from '../../../../../../application/auth/services/AuthService';
import { loginValidator } from '../../../../../../application/auth/AuthValidator';
import { userModelValidator } from '../../../../../../application/users/UserValidator';
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
  async registerUser(@Body()user: IUserModel): Promise<unknown> {
    const registerUserUseCase = new RegisterUserUseCase(this.userRepository);

    const newUser = validate(userModelValidator, user) as IUserModel;
    return registerUserUseCase.execute({
      ...newUser,
      displayName: newUser.displayName || newUser.firstName,
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
      password: ''
    };

    await createUserUseCase.execute(newUser);
    return;
  }

  async generateAuthToken(email: string) {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);

    const existingUser = await getUserByEmailUseCase.execute(email);
    if (!existingUser) throw new NotFoundError('User');

    const token = this.authService.generateToken(existingUser._id, existingUser.email);
    return token;
  }

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getAuthenticatedUserData(id: string) {
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(this.userRepository);

    const existingUser = await getFilteredUserDataUseCase.execute(id);

    if (!existingUser) throw new NotFoundError('User');
    return existingUser;
  }

}
