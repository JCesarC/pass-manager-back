import { IGoogleProfile } from '../models/IGoogleProfileModel';
import { IAuthCredentials } from './IAuthCredentials';

export interface IAuthController {
  registerUser(user: unknown): Promise<unknown>;
  loginUser(authCredentials: IAuthCredentials): Promise<unknown>;
  signInByGoogle(user: IGoogleProfile): Promise<unknown>;
  logoutUser(): Promise<unknown>;
};
