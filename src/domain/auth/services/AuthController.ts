import { IUserModel } from '../../../Collections/users/models/IUserModel';
import { IAuthCredentials, IAuthController } from '../interfaces';
import { AuthService } from './AuthService';

import { AUTH_ERRORS } from '../../../constants';
import { Body, Post, Route, Tags } from 'tsoa';

@Route('/api/auth')
@Tags('AuthController')
export class AuthController implements IAuthController {

  private authService;
  constructor(){
    this.authService = new AuthService();
  }

  @Post('/register')
  async registerUser(@Body()user: IUserModel): Promise<unknown> {
    const { firstName, lastName, email, password } = user;
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

  loginByGoogle(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  logoutUser(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

}
