import { IUserModel } from '../models/IUserModel';
import { UserResponse } from '../types/UserResponse.type';
import { UserRepository } from './UserRepository';

export class UserService {
  private userRepository;
  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getAll(page: number, limit: number): Promise<UserResponse> {
    try {
      const users = await this.userRepository.getUsersPaginated(page, limit);
      const total = await this.userRepository.countDocuments();
      const totalPages = Math.ceil(total / limit);

      const response: UserResponse = {
        users,
        totalPages,
        currentPage: page
      };

      return response;
    } catch (error) {
      throw new Error('Error getting Users.'+error);
    }
  }
  // * TODO: get user by name
  public async getUserById(id: string) {
    const product = await this.userRepository.getById(id);
    return product;
  }

  public async newUser(user: IUserModel) {
    const response = await this.userRepository.create(user);
    return response;
  }

  public async deleteUser(id: string) {
    const response = await this.userRepository.delete(id);
    return response;
  };
};
