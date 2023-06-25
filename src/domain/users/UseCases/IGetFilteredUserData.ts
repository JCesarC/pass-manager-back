import { IUserResponseModel } from '../interfaces';

export interface IGetFilteredUserDataUseCase {
  execute(id: string): Promise<IUserResponseModel | null>
}
