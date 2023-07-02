import { UserResponse } from '../types/UserResponseType';

export interface IGetAllUsersUseCase {
  execute(page: number, limit: number): Promise<UserResponse>
}
