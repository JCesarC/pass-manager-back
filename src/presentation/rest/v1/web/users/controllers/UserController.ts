import { Example, Get, Inject, OperationId, Response, Route, Security, Tags } from 'tsoa';

import { GetFilteredUserDataUseCase } from '../../../../../../application/users/UseCases';
import { NotFoundError } from '../../../../../../application/shared';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

import { ErrorResponseBody, presentUser, UserResponse } from '../../../contracts';

@Route('/api/v1/users')
@Tags('Users')
@Security('bearer')
@Response<ErrorResponseBody>(401, 'Missing, invalid or expired access token', {
  error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
})
export class UserController {
  /**
   * @summary Get the authenticated user's profile
   */
  @Get('/me')
  @OperationId('getMe')
  @Example<UserResponse>({
    user: {
      _id: '6650f1a2b3c4d5e6f7a8b9c0',
      email: 'jane.doe@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      displayName: 'Jane',
      roles: [],
      active: true,
      verified: true,
    },
  })
  async getMe(@Inject() userId: string): Promise<UserResponse> {
    const user = await new GetFilteredUserDataUseCase(new UserRepository()).execute(userId);
    if (!user) throw new NotFoundError('User');
    return { user: presentUser(user) };
  }
}
