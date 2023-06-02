
export interface IUserController {

  // * TODO: Implement types to replace Promise<any>
  getUsers(page: number, limit: number): Promise<any>;
  getUserById(id: string): Promise<any>;
  deleteUserById(id: string): Promise<any>;
  updateUser(id: string, user: any): Promise<any>;
};
