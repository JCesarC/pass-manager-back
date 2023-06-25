import { IUserResponseModel } from '../interfaces';

export interface IGetUserByEmailUseCase {
  execute(email: string): Promise<IUserResponseModel | null>
}
