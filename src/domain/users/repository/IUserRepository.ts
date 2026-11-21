import { IUserModel, IUserResponseModel } from '../interfaces';

export interface IUserRepository {
  getAll(): Promise<IUserResponseModel[] | null>;
  getById(id: string): Promise<IUserResponseModel | null>;
  create(userData: IUserModel): Promise<IUserResponseModel>;
  update(id: string, userData: IUserModel): Promise<IUserResponseModel | null>;
  delete(id: string): Promise<any>;
  countDocuments(): Promise<number>;
  getUserById(_id: string): Promise<IUserModel | null>;
  getUserByEmail(email: string): Promise<IUserResponseModel | null>;
  getFilteredUserData(_id: string): Promise<IUserResponseModel | null>
  /** Counts a failed sign-in and locks the account once maxAttempts is reached. */
  registerFailedLogin(_id: string, maxAttempts: number, lockMinutes: number): Promise<void>;
  resetFailedLogins(_id: string): Promise<void>;
};
