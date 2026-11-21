import { IAuthCredentials } from './IAuthCredentials';

export interface IAuthController {
  registerUser(user: unknown): Promise<unknown>;
  loginUser(authCredentials: IAuthCredentials): Promise<unknown>;
  logoutUser(refreshToken: string | undefined): Promise<void>;
};
