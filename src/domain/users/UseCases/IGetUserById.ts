import { IUserResponseModel } from '../interfaces';

export interface IGetUserByIdUseCase {
  execute(id: string): Promise<IUserResponseModel | null>
}
