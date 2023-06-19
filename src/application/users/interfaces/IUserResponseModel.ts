import { IUserModel } from './IUserModel';

export interface IUserResponseModel extends IUserModel {
  _id: string;
  __v?: string;
}
