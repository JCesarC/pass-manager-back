import { IUserResponseModel } from './IUserResponseModel';

export interface IUserController {
  getMe(userId: string): Promise<IUserResponseModel>;
}
