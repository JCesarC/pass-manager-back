import bcrypt from 'bcrypt';

import { USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';
import { ConflictError, InvalidCredentialsError, NotFoundError } from '../../shared';

import { IUserResponseModel } from '../../../domain/users/interfaces';

const SALTS = 10;
export class AuthService {

  validateUserExistsByEmail(
    foundUser: IUserResponseModel | null,
    email: string,
    validationType: string,
  ): IUserResponseModel | null {

    switch (validationType) {
    case USER_EXISTS_TYPES.EXIST_ON_LOGIN:
      if (!foundUser) throw new InvalidCredentialsError();
      return foundUser;
    case USER_EXISTS_TYPES.EXISTS:
      if (!foundUser) throw new NotFoundError('User');
      return foundUser;
    case USER_EXISTS_TYPES.NOT_EXISTS:
      if (foundUser) throw new ConflictError('This email is already registered.');
      return null;
    default:
      return null;
    }
  }

  hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, SALTS);
    return hashedPassword;
  }

  comparePassword(password: string, hashedPassword: string): boolean {
    const isValidPassword = bcrypt.compareSync(password, hashedPassword);
    return isValidPassword;
  }
}
