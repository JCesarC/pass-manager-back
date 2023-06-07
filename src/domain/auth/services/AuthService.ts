import { IUserResponseModel, IUserModel } from '../../../Collections/users/models';
import { UserService } from '../../../Collections/users/services/UserService';
import { AUTH_ERRORS } from '../../../constants';
import { comparePassword, generateToken, hashPassword } from '../../../utils/AuthUtils';
import { IAuthCredentials } from '../interfaces';

export class AuthService {

  private userService;
  constructor(){
    this.userService = new UserService();
  }

  async registerUser(userData: IUserModel) {
    try {
      const { password: passwordString } = userData;
      const hashedPassword = hashPassword(passwordString);

      const user = {
        ...userData,
        password: hashedPassword
      };

      const response: IUserResponseModel = await this.userService.createUser(user);
      const formattedResponse = {
        error: false,
        user: {
          firstName: response.firstName,
          lastName: response.lastName,
          _id: response._id
        }
      };
      return formattedResponse;
    } catch (error) {
      throw new Error('Registering new user: '+ error);
    }
  }

  async loginUser(authCredentials: IAuthCredentials) {
    try {
      const { email, password } = authCredentials;

      const foundUser = await this.userService.getUserByEmail(email);
      if (!foundUser) throw new Error(`User with email: ${email} ${AUTH_ERRORS.NOT_FOUND}`);

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
