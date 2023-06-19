import { UserService } from '../../../application/users/UseCases/UserUseCase';
import { AUTH_ERRORS, USER_EXISTS_TYPES } from '../../shared/constants/AuthContants';
import { comparePassword, generateToken, hashPassword } from '../../../utils/AuthUtils';
import { IAuthCredentials } from '../interfaces';
import { IUserModel, IUserResponseModel } from '../../../application/users/interfaces';

export class AuthService {

  private userService;
  constructor(){
    this.userService = new UserService();
  }

  private async validateUserExistsByEmail(email: string, validationType: string): Promise<IUserResponseModel | null>{
    const foundUser = await this.userService.getUserByEmail(email);

    switch (validationType) {
    case USER_EXISTS_TYPES.EXIST_ON_LOGIN:
      if (!foundUser) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
      return foundUser;
    case USER_EXISTS_TYPES.EXISTS:
      if (!foundUser) throw new Error(`User with email: ${email} ${AUTH_ERRORS.NOT_FOUND}`);
      return foundUser;
    case USER_EXISTS_TYPES.NOT_EXISTS:
      if (foundUser) throw new Error(`User with email: ${email} ${AUTH_ERRORS.EMAIL_ALREADY_EXISTS}`);
      return null;
    default:
      return null;
    }
  }

  async registerUser(newUserData: IUserModel) {
    try {
      const { password: passwordString, email } = newUserData;
      const hashedPassword = hashPassword(passwordString);

      const user = {
        ...newUserData,
        password: hashedPassword
      };

      await this.validateUserExistsByEmail(email, USER_EXISTS_TYPES.NOT_EXISTS);

      const response: IUserResponseModel = await this.userService.createUser(user);
      const userData = await this.userService.getFilteredUserData(response._id);

      return {
        error: false,
        user: userData
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication Failed. ${error.message}`);
      } else {
        throw new Error(`Authentication Failed. ${error}`);
      }
    }
  }

  async loginUser(authCredentials: IAuthCredentials) {
    try {
      const { email, password } = authCredentials;

      const foundUser = await this.validateUserExistsByEmail(email, USER_EXISTS_TYPES.EXIST_ON_LOGIN);

      if (!foundUser) throw new Error(`Cannot find user with email: ${foundUser}`);

      const validPassword = comparePassword(password, foundUser.password,);
      if (!validPassword) throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);

      const token = generateToken(foundUser._id, foundUser.email);

      const userData = await this.userService.getFilteredUserData(foundUser._id);

      return {
        error: false,
        user: userData,
        token
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Authentication Failed. ${error.message}`);
      } else {
        throw new Error(`Authentication Failed. ${error}`);
      }
    }
  }
}
