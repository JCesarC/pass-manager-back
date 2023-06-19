import { IUserModel } from '../interfaces/IUserModel';
import { UserResponse } from '../types/UserResponse.type';
import { UserRepository } from '../repository/UserRepository';

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
  };

  async getFilteredUserData(_id: string) {
    try {
      const userData = await this.userRepository.getFilteredUserData(_id);
      return userData;
    } catch (error: any) {
      throw new Error(`Getting User by Id: ${_id}`);
    }
  }

  public async getOneUserById(_id: string) {
    try {
      const user = await this.userRepository.getUserById(_id);
      return user;
    } catch (error) {
      throw new Error(`Getting User by Id: ${_id}.`+error);
    }
  }

  // * TODO: get user by name
  public async getUserById(_id: string) {
    try {
      const user = await this.userRepository.getById(_id);
      return user;
    } catch (error) {
      throw new Error(`Getting User by Id: ${_id}.`+error);
    }
  }

  public async getUserByEmail(email: string){
    try {
      const user = await this.userRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Getting User by email: ${email}.`+error);
    }
  }

  public async createUser(user: IUserModel) {
    try {
      const response = await this.userRepository.create(user);
      return response;
    } catch (error) {
      throw new Error('Creating User:.'+error);
    }
  }

  public async createBySocialProfile(user: any) {
    try {
      const response = await this.userRepository.create(user);
      return response;
    } catch (error) {
      throw new Error('Creating User by social profile:.'+error);
    }
  }

  public async deleteUser(_id: string) {
    try {
      const response = await this.userRepository.delete(_id);
      return response;
    } catch (error) {
      throw new Error(`Deleting User with id: ${_id}:.`+error);
    }
  };
};
