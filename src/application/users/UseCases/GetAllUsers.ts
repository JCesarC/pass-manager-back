import { IGetAllUsersUseCase } from '../../../domain/users/UseCases';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';
import { UserResponse } from '../../../domain/users/types/UserResponseType';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  private userRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }

  async execute(page: number, limit: number): Promise<UserResponse> {
    const users = await this.userRepository.getUsersPaginated(page, limit);
    const total = await this.userRepository.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const response: UserResponse = {
      users,
      totalPages,
      currentPage: page
    };

    return response;
  }
}
