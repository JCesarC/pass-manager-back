import { IUserModel, IUserResponseModel } from '../interfaces';

export interface ICreateUserUseCase {
  execute(userData: IUserModel): Promise<IUserResponseModel>
};
