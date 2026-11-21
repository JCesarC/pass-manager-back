import mongoose from 'mongoose';

import UserModel from '../models/UserSchema';

import { IUserResponseModel, IUserModel } from '../../../../../../domain/users/interfaces';
import { IUserRepository } from '../../../../../../domain/users/repository/IUserRepository';
import { injectable } from 'inversify';

/** Fields that must never leave the API. */
const PRIVATE_FIELDS = { __v: 0, password: 0, failedLoginAttempts: 0, lockUntil: 0 };

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
    return await UserModel.findById(_id, PRIVATE_FIELDS);
  }

  async registerFailedLogin(_id: string, maxAttempts: number, lockMinutes: number): Promise<void> {
    const user = await UserModel.findByIdAndUpdate(
      _id,
      { $inc: { failedLoginAttempts: 1 } },
      { new: true, projection: { failedLoginAttempts: 1 } },
    );

    if (user && (user.failedLoginAttempts ?? 0) >= maxAttempts) {
      await UserModel.updateOne(
        { _id },
        { $set: { failedLoginAttempts: 0, lockUntil: new Date(Date.now() + lockMinutes * 60_000) } },
      );
    }
  }

  async resetFailedLogins(_id: string): Promise<void> {
    await UserModel.updateOne({ _id }, { $set: { failedLoginAttempts: 0, lockUntil: null } });
  }
}
