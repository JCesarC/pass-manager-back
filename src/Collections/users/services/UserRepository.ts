import mongoose from 'mongoose';
import { BaseRepository } from '../../base/services/BaseRepository';
import { UserModel } from '../dataAccess/UserSchema';
import { IUserResponseModel } from '../models';
import { IUserModel } from '../models/IUserModel';

export class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async getUserById(_id: string){
    const objectId = new mongoose.Types.ObjectId(_id);
    const foundUser = await this.model.findOne({ _id: objectId });
    return foundUser;
  }

  async getUserByEmail(email: string){
    const foundUser = await this.model.findOne({ email });
    return foundUser;
  }

  async getFilteredUserData(_id: string): Promise<IUserResponseModel>{
    const foundUser = await this.model.findById(_id, { __v: 0, password: 0 });
    return foundUser;
  }

  async getAllUsers(): Promise<IUserModel[]> {
    const users = await this.model.find({}, { __v: 0, password: 0 }).exec();
    return users;
  }

  async getUsersPaginated(page: number, limit: number): Promise<IUserModel[]> {
    const users = await this.model
      .find({}, { __v: 0, password: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    return users;
  }
}
