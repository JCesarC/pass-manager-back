import { IUserResponseExample } from '../interfaces';

export type UserResponseExample = {
  users: IUserResponseExample [],
  totalPages: number,
  currentPage: number
}
