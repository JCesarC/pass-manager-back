import { Body, Post, Route, Tags } from 'tsoa';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';
import { AUTH_ERRORS } from '../../../../../../domain/shared/constants/AuthContants';

import { LoginUserUseCase, RegisterUserUseCase } from '../../../../../../application/auth/UseCases';
import {
  CreateUserUseCase,
  GetFilteredUserDataUseCase,
  GetUserByEmailUseCase,
} from '../../../../../../application/users/UseCases';
import { AuthService } from '../../../../../../application/auth/services/AuthService';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService;
  constructor(){
    this.authService = new AuthService();
  }

  @Post('/register')
  async registerUser(@Body()user: IUserModel): Promise<unknown> {
    const userRepository = new UserRepository();
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

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
    const userRepository = new UserRepository();
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    const { email, password } = authCredentials;
    if(email && password ) {
      const response = await loginUserUseCase.execute(authCredentials);
      return response;
    }
    throw new Error(AUTH_ERRORS.CREDENTIALS_NOT_FOUND);
  }

  async signInByGoogle(user: IGoogleProfile): Promise<unknown> {
    const userRepository = new UserRepository();
    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    const createUserUseCase = new CreateUserUseCase(userRepository);

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
    const userRepository = new UserRepository();
    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

    const existingUser = await getUserByEmailUseCase.execute(email);
    if (!existingUser) throw new Error(`Cannot find user with email: ${email} in DB`);

    const token = this.authService.generateToken(existingUser._id, existingUser.email);
    return token;
  }

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getAuthenticatedUserData(id: string) {
    const userRepository = new UserRepository();
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(userRepository);

    const existingUser = await getFilteredUserDataUseCase.execute(id);

    if (!existingUser) throw new Error(`Cannot find user with id: ${id}`);
    return existingUser;
  }

}
