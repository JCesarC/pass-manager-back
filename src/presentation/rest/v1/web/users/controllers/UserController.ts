import { Get, Query, Route, Tags } from 'tsoa';
import { IUserController } from '../../../../../../application/users/interfaces/IUserController';
import { UserService } from '../../../../../../application/users/UseCases/UserUseCase';
import { IUserResponseModel } from '../../../../../../application/users/interfaces';

@Route('/api/users')
@Tags('UserController')
export class UserController implements IUserController {

  private userService;
  constructor() {
    this.userService = new UserService();
  }
  /**
   * Enpoint to retrive all users data paginated
   * @param especific number of page to show
   * @param limit per page to show users
   * @returns A group of users
   */

  @Get('/')
  async getUsers(@Query()page: number,@Query()limit: number): Promise<any> {
    const users = await this.userService.getAll(page, limit);
    return users;
  }

  async getUserData(id: string): Promise<IUserResponseModel | null> {
    const user = await this.userService.getFilteredUserData(id);
    return user;
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  deleteUserById(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  updateUser(id: string, user: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

};
