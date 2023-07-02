import { IGetFilteredUserDataUseCase } from '../../../domain/users/UseCases/IGetFilteredUserData';
import { IUserResponseModel } from '../../../domain/users/interfaces';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

export class GetFilteredUserDataUseCase implements IGetFilteredUserDataUseCase {

  private userRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<IUserResponseModel | null> {
    const userData = await this.userRepository.getFilteredUserData(id);
    return userData;
  }

}
