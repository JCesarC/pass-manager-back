import { GetFilteredUserDataUseCase, GetUserByEmailUseCase } from '../../users/UseCases';
import { AuthService } from '../services/AuthService';

import { IAuthCredentials } from '../../../domain/auth/interfaces';
import { IUserRepository } from '../../../domain/users/repository/IUserRepository';

import { AUTH_ERRORS, USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';

export class LoginUserUseCase {
  private authService;
  private userRepository;

  constructor(userRepository: IUserRepository) {
    this.authService = new AuthService();
    this.userRepository = userRepository;
  }

  async execute(authCredentials: IAuthCredentials){
    const getUserByEmailUseCase = new GetUserByEmailUseCase(this.userRepository);
    const getFilteredUserDataUseCase = new GetFilteredUserDataUseCase(this.userRepository);

    const { email, password } = authCredentials;

    const userFound = await getUserByEmailUseCase.execute(email);
    await this.authService.validateUserExistsByEmail(
      userFound,
      email,
      USER_EXISTS_TYPES.EXIST_ON_LOGIN,
    );

    if (!userFound) throw new Error(`Cannot find user with email: ${email}`);

    const validPassword = this.authService.comparePassword(password, userFound.password);
    if (!validPassword) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);

    const token = this.authService.generateToken(userFound._id, userFound.email);
    const userData = await getFilteredUserDataUseCase.execute(userFound._id);

    return {
      error: false,
      user: userData,
      token,
    };
  }
}
