import { IUserModel } from '../../../domain/users/interfaces/IUserModel';

export type UserResponse = {
  users: IUserModel [],
  totalPages: number,
  currentPage: number
};
