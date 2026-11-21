import { IBaseRepository } from '../../base/repository/IBaseRepository';
import { IOwnedRepository } from '../../base/repository/IOwnedRepository';
import { INoteModel } from '../interfaces';

export interface INoteRepository extends IBaseRepository<INoteModel>, IOwnedRepository<INoteModel> {}
