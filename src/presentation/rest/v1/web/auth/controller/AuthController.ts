import { Body, Post, Route, Tags } from 'tsoa';

import { AuthService } from '../../../../../../application/auth/services/AuthService';
import { UserService } from '../../../../../../application/users/UseCases/UserUseCase';

import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { IAuthCredentials, IAuthController } from '../../../../../../domain/auth/interfaces';
import { IUserModel } from '../../../../../../domain/users/interfaces';

import { AUTH_ERRORS } from '../../../../../../domain/shared/constants/AuthContants';
import { generateToken } from '../../../../../../utils/AuthUtils';

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService;
  private userService;
  constructor(){
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  @Post('/register')
  async registerUser(@Body()user: IUserModel): Promise<unknown> {
    const { firstName, lastName, email, password } = user;
    console.log('firstName, lastName, email, password: ', firstName, lastName, email, password);
    if(firstName && lastName && email && password ) {
      const response = await this.authService.registerUser(user);
      return response;
    }
    throw new Error(AUTH_ERRORS.DATA_NOT_FOUND);
  }

  @Post('/login')
  async loginUser(@Body()authCredentials: IAuthCredentials): Promise<unknown> {
    const { email, password } = authCredentials;
    if(email && password ) {
      const response = await this.authService.loginUser(authCredentials);
      return response;
    }
    throw new Error(AUTH_ERRORS.CREDENTIALS_NOT_FOUND);
  }

  async signInByGoogle(user: IGoogleProfile): Promise<unknown> {

    // * TODO: Validate by Email and if it exists just dont create new user
    const { email } = user._json;
    const existingUser = await this.userService.getUserByEmail(email);

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

    await this.userService.createBySocialProfile(newUser);
    return;
  }

  async generateAuthToken(email: string) {
    const existingUser = await this.userService.getUserByEmail(email);
    if (!existingUser) throw new Error(`Cannot find user with email: ${email} in DB`);

    const token = generateToken(existingUser._id, existingUser.email);
    return token;
  }

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  async getAuthenticatedUserData(id: string) {
    const existingUser = await this.userService.getFilteredUserData(id);

    if (!existingUser) throw new Error(`Cannot find user with id: ${id}`);
    return existingUser;
  }

}
