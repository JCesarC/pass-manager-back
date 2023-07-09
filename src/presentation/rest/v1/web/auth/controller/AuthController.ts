import { Body, Post, Route, Tags } from 'tsoa';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';

import { AUTH_ERRORS } from '../../../../../../domain/shared/constants/AuthContants';

import { LoginUserUseCase, RegisterUserUseCase } from '../../../../../../application/auth/UseCases';
import {
  CreateUserUseCase,
  GetFilteredUserDataUseCase,
  GetUserByEmailUseCase,
} from '../../../../../../application/users/UseCases';
import { AuthService } from '../../../../../../application/auth/services/AuthService';

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService;
  private userRepository;

  constructor(userRepository: IUserRepository){
    this.authService = new AuthService();
    this.userRepository = userRepository;
  }

  @Post('/register')
  async registerUser(@Body()user: IUserModel): Promise<unknown> {
    const registerUserUseCase = new RegisterUserUseCase(this.userRepository);

    const { firstName, lastName, email, password } = user;
    console.log('firstName, lastName, email, password: ', firstName, lastName, email, password);
    if(firstName && lastName && email && password ) {
      const response = await registerUserUseCase.execute(user);
      return response;
    }
    throw new Error(AUTH_ERRORS.DATA_NOT_FOUND);
  }

  @Post('/login')
  async loginUser(@Body()authCredentials: IAuthCredentials): Promise<unknown> {
    const loginUserUseCase = new LoginUserUseCase(this.userRepository);

    const { email, password } = authCredentials;
    if(email && password ) {
      const response = await loginUserUseCase.execute(authCredentials);
      return response;
    }
    throw new Error(AUTH_ERRORS.CREDENTIALS_NOT_FOUND);
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
    if (!existingUser) throw new Error(`Cannot find user with email: ${email} in DB`);

    const token = this.authService.generateToken(existingUser._id, existingUser.email);
    return token;
  }

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getAuthenticatedUserData(id: string) {
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(this.userRepository);

    const existingUser = await getFilteredUserDataUseCase.execute(id);

    if (!existingUser) throw new Error(`Cannot find user with id: ${id}`);
    return existingUser;
  }

}
