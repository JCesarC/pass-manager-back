import { IUserModel, IUserResponseModel } from '../../../domain/users/interfaces';
import { ICreateUserUseCase } from '../../../domain/users/UseCases/ICreateUserUseCase';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

export class CreateUserUseCase implements ICreateUserUseCase{
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }
  async execute(userData: IUserModel): Promise<IUserResponseModel> {
    const createdUser = await this.userRepository.create(userData);
    return createdUser;
  }
}
