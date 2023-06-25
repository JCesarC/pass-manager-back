import { IGetUserByEmailUseCase } from '../../../domain/users/UseCases/IGetUserByEmailUseCase';
import { IUserResponseModel } from '../../../domain/users/interfaces';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

export class GetUserByEmailUseCase implements IGetUserByEmailUseCase{

  private userRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }

  async execute(email: string): Promise<IUserResponseModel | null> {
    const user = await this.userRepository.getUserByEmail(email);
    return user;
  }

}
