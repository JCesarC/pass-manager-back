import { IUserResponseModel } from '../interfaces';

export type UserResponse = {
  users: IUserResponseModel [],
  totalPages: number,
  currentPage: number
};
