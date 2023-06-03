import { IUserResponseModel, IUserModel } from '../../../Collections/users/models';
import { UserRepository } from '../../../Collections/users/services/UserRepository';
import { hashPassword } from '../../../utils/AuthUtils';

export class AuthService {

  private userRepository;

  constructor(){
    this.userRepository = new UserRepository();
  }

  async registerUser(userData: IUserModel) {
    try {
      const { password: passwordString } = userData;
      const hashedPassword = hashPassword(passwordString);

      const user = {
        ...userData,
        password: hashedPassword
      };

      const response: IUserResponseModel = await this.userRepository.create(user);
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
}
