import { IUserModel } from '../interfaces/IUserModel';

export type UserResponse = {
  users: IUserModel [],
  totalPages: number,
  currentPage: number
};
