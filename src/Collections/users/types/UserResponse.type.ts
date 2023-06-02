import { IUserModel } from '../models/IUserModel';

export type UserResponse = {
  users: IUserModel [],
  totalPages: number,
  currentPage: number
};
