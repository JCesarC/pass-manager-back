import {
  CreateUserUseCase,
  GetFilteredUserDataUseCase,
  GetUserByEmailUseCase,
} from '../../users/UseCases';

import { AuthService } from '../services/AuthService';

import { IUserModel } from '../../../domain/users/interfaces';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

import { USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';

export class RegisterUserUseCase {
  private authService;
  private userRepository;

  constructor(userRepository: IUserRepository) {
    this.authService = new AuthService();
    this.userRepository = userRepository;
  }

  async execute(newUserData: IUserModel) {
    const createUserUseCase = new CreateUserUseCase(this.userRepository);
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(this.userRepository);

    const { password: passwordString, email } = newUserData;

    const userFound = await getUserByEmailUseCase.execute(email);
    await this.authService.validateUserExistsByEmail(
      userFound,
      email,
      USER_EXISTS_TYPES.NOT_EXISTS,
    );

    const hashedPassword = this.authService.hashPassword(passwordString);

    const user = {
      ...newUserData,
      password: hashedPassword,
    };

    const response = await createUserUseCase.execute(user);
    const userData = await getFilteredUserDataUseCase.execute(response._id);

    return {
      user: userData,
    };
  }
}
