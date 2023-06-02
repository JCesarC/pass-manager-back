import { BaseRepository } from '../../base/services/BaseRepository';
import { UserModel } from '../dataAccess/UserSchema';
import { IUserModel } from '../models/IUserModel';

export class UserRepository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  async getAllUsers(): Promise<IUserModel[]> {
    const users = await this.model.find({}, { __v: 0 }).exec();
    return users;
  }

  async getUsersPaginated(page: number, limit: number): Promise<IUserModel[]> {
    const users = await this.model
      .find({}, { __v: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    return users;
  }
}
