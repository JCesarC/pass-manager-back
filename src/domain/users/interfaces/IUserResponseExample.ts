import { IUserModel } from './IUserModel';

import { IExampleResponse } from '../../shared/interfaces';

export interface IUserResponseExample extends Omit<IUserModel, 'password'>, IExampleResponse {
}
