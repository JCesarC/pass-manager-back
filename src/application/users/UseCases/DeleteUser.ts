import { IDeleteUserUseCase } from '../../../domain/users/UseCases';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

export class DeleteUserUseCase implements IDeleteUserUseCase {

  private userRepository;

  constructor(userRepository: IUserRepository){
    this.userRepository = userRepository;
  }

  async execute(id: string): Promise<any> {
    const response = await this.userRepository.delete(id);
    return response;
  }

}
