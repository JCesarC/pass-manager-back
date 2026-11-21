import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { env } from '../../../infrastructure/shared/config';
import { USER_EXISTS_TYPES } from '../../../domain/shared/constants/AuthContants';
import { ConflictError, InvalidCredentialsError, NotFoundError } from '../../shared';

import { IUserResponseModel } from '../../../domain/users/interfaces';

const SALTS = 10;
const EXPIRATION_TIME = '1h';
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

  generateToken(_id: string, email: string): string {
    const token = jwt.sign({ _id, email }, env.JWT_SECRET, {
      expiresIn: EXPIRATION_TIME,
    });
    return token;
  }

  validateToken = (token: string) => {
    const decodedToken: JwtPayload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return decodedToken;
  };
}
