import mongoose from 'mongoose';
import { IUserModel } from '../interfaces/IUserModel';
import UserModel from '../models/UserSchema';
import { IUserResponseModel } from '../interfaces';

export class UserRepository {

  async getAll(): Promise<unknown> {
    return await UserModel.find({});
  };

  async getById(id: string): Promise<IUserModel | null> {
    return await UserModel.findById(id);
  }

  async create(entity: any): Promise<any> {
    return await UserModel.create(entity);
  }

  async update(id: string, entity: any): Promise<IUserResponseModel | null> {
    return await UserModel.findByIdAndUpdate(id, entity, { new: true });
  }

  async delete(id:string): Promise<any> {
    return await UserModel.findByIdAndDelete(id);
  };

  async countDocuments(): Promise<any> {
    return await UserModel.countDocuments();
  }
  async getUserById(_id: string): Promise<IUserModel | null>{
    const objectId = new mongoose.Types.ObjectId(_id);
    return UserModel.findOne({ _id: objectId });
  }

  async getUserByEmail(email: string): Promise<IUserResponseModel | null>{
    return await UserModel.findOne({ email });
  }

  async getAllUsers(): Promise<IUserModel[]> {
    const users = await UserModel.find({}, { __v: 0, password: 0 }).exec();
    return users;
  }

  async getFilteredUserData(_id: string): Promise<IUserResponseModel | null>{
    return await UserModel.findById(_id, { __v: 0, password: 0 });
  }

  async getUsersPaginated(page: number, limit: number): Promise<IUserModel[]> {
    const users = await UserModel
      .find({}, { __v: 0, password: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    return users as IUserModel[];
  }
}
