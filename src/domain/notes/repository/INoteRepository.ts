
import { IBaseRepository } from '../../base/repository/IBaseRepository';
import { INoteModel } from '../interfaces';

export interface INoteRepository extends IBaseRepository<INoteModel> {
  getNotesByUser(userId: string): Promise<INoteModel[] | null>;
};
