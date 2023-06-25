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
  getAllUsers(): Promise<IUserModel[]>;
  getFilteredUserData(_id: string): Promise<IUserResponseModel | null>
  getUsersPaginated(page: number, limit: number): Promise<IUserResponseModel[]>;
};
