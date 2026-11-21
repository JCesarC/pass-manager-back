import mongoose from 'mongoose';

import UserModel from '../models/UserSchema';

import { IUserResponseModel, IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';
import { injectable } from 'inversify';

@injectable()
export class UserRepository implements IUserRepository{

  async getAll(): Promise<IUserResponseModel[] | null> {
    return await UserModel.find({});
  };

  async getById(id: string): Promise<IUserResponseModel | null> {
    return await UserModel.findById(id);
  }

  async create(userData: IUserModel): Promise<IUserResponseModel> {
    return await UserModel.create(userData);
  }

  async update(id: string, entity: any): Promise<IUserResponseModel | null> {
    return await UserModel.findByIdAndUpdate(id, entity, { new: true });
  }

  async delete(id:string): Promise<any> {
    return await UserModel.findByIdAndDelete(id);
  };

  async countDocuments(): Promise<number> {
    return await UserModel.countDocuments();
  }
  async getUserById(_id: string): Promise<IUserModel | null>{
    const objectId = new mongoose.Types.ObjectId(_id);
    return UserModel.findOne({ _id: objectId });
  }

  async getUserByEmail(email: string): Promise<IUserResponseModel | null>{
    return await UserModel.findOne({ email });
  }

  async getFilteredUserData(_id: string): Promise<IUserResponseModel | null>{
    return await UserModel.findById(_id, { __v: 0, password: 0 });
  }
}
