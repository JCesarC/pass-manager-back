import { IGetUserByIdUseCase } from '../../../domain/users/UseCases/IGetUserById';
import { IUserResponseModel } from '../../../domain/users/interfaces';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  private userRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<IUserResponseModel | null> {
    const user = await this.userRepository.getById(id);
    return user;
  }

}
