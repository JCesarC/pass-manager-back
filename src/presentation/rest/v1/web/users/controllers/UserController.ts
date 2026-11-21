import { Example, Get, Query, Response, Route, SuccessResponse, Tags } from 'tsoa';

import {
  GetAllUsersUseCase,
  GetFilteredUserDataUseCase,
  GetUserByIdUseCase,
} from '../../../../../../application/users/UseCases';

import { IUserController } from '../../../../../../domain/users/interfaces/IUserController';
import { IUserResponseModel } from '../../../../../../domain/users/interfaces';
import { UserResponseExample, UserResponse } from '../../../../../../domain/users/types';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

@Route('/api/v1/users')
@Tags('UserController')
export class UserController implements IUserController {
  /**
   * Tsoa documentation for this endpoint with optional page and limit query params
   *
   * @param {number} page - The page number
   * @param {number} limit - The limit per page
   * @returns {Promise<UserResponseExample>} - The response data
   */

  @Get('/')
  @SuccessResponse('200', 'Success')
  @Example<UserResponse>({
    users: [],
    totalPages: 1,
    currentPage: 1,
  })
  @Response<UserResponseExample>('200', 'Success', {
    users: [
      {
        photoURL: '',
        verified: false,
        _id: '647b74c0b05e9795e0be8b5e',
        email: 'jane.doe@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        roles: [],
        active: false,
        displayName: 'Example'
      },
      {
        photoURL: '',
        verified: false,
        _id: '647b764d38ba527a9bada83e',
        email: 'john.smith@example.com',
        firstName: 'John',
        lastName: 'Smith',
        roles: [],
        active: false,
        displayName: 'Example'

      },
    ],
    totalPages: 3,
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

  deleteUserById(_id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  updateUser(_id: string, _user: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
};
