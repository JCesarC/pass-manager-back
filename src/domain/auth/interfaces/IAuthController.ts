import { IUserModel } from '../../../Collections/users/models/IUserModel';
import { IAuthCredentials } from './IAuthCredentials';

export interface IAuthController {
  registerUser(user: IUserModel): Promise<unknown>;
  loginUser(authCredentials: IAuthCredentials): Promise<unknown>;
  loginByGoogle(): Promise<unknown>;
  logoutUser(): Promise<unknown>;
};
