import { Example, Get, Query, Route, SuccessResponse, Tags } from 'tsoa';

import {
  GetAllUsersUseCase,
  GetFilteredUserDataUseCase,
  GetUserByIdUseCase,
} from '../../../../../../application/users/UseCases';

import { IUserController } from '../../../../../../domain/users/interfaces/IUserController';
import { IUserResponseModel } from '../../../../../../domain/users/interfaces';
import { UserResponse } from '../../../../../../domain/users/types/UserResponseType';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

@Route('/api/users')
@Tags('UserController')
export class UserController implements IUserController {
  /**
   * Enpoint to retrive all users data paginated
   * @param especific number of page to show
   * @param limit per page to show users
   * @returns A group of users
   */

  @Get('/')
  @SuccessResponse('200', 'Success')
  @Example<UserResponse>({
    users: [],
    totalPages: 1,
    currentPage: 1,
  })
  async getUsers(@Query() page: number, @Query() limit: number): Promise<unknown> {
    const userRepository = new UserRepository();
    const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
    const users = await getAllUsersUseCase.execute(page, limit);
    return users;
  }

  async getUserData(id: string): Promise<IUserResponseModel | null> {
    const userRepository = new UserRepository();
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(userRepository);

    const user = await getFilteredUserDataUseCase.execute(id);
    return user;
  }

  async getUserById(id: string): Promise<unknown> {
    const userRepository = new UserRepository();
    const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
    const user = await getUserByIdUseCase.execute(id);
    return user;
  }

  deleteUserById(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  updateUser(id: string, user: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
};
