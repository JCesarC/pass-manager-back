import { IUserModel } from '../../users/interfaces/IUserModel';
import { IGoogleProfile } from '../models/IGoogleProfileModel';
import { IAuthCredentials } from './IAuthCredentials';

export interface IAuthController {
  registerUser(user: IUserModel): Promise<unknown>;
  loginUser(authCredentials: IAuthCredentials): Promise<unknown>;
  signInByGoogle(user: IGoogleProfile): Promise<unknown>;
  logoutUser(): Promise<unknown>;
};
