import { Document } from 'mongoose';
import { IUserModel } from './IUserModel';

export interface IUserResponseModel extends IUserModel, Document {
}
