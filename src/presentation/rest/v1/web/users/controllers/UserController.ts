import { Get, Inject, Route, Security, Tags } from 'tsoa';

import { GetFilteredUserDataUseCase } from '../../../../../../application/users/UseCases';
import { NotFoundError } from '../../../../../../application/shared';

import { IUserController } from '../../../../../../domain/users/interfaces/IUserController';
import { IUserResponseModel } from '../../../../../../domain/users/interfaces';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

@Route('/api/v1/users')
@Tags('UserController')
@Security('bearer')
export class UserController implements IUserController {
  /** Profile of the authenticated user (never includes the password hash). */
  @Get('/me')
  async getMe(@Inject() userId: string): Promise<IUserResponseModel> {
    const user = await new GetFilteredUserDataUseCase(new UserRepository()).execute(userId);
    if (!user) throw new NotFoundError('User');
    return user;
  }
}
