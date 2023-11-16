
import { IBaseRepository } from '../../base/repository/IBaseRepository';
import { INoteModel } from '../interfaces';

export interface INoteRepository extends IBaseRepository<INoteModel> {
  getAllNotesPaginated(page: number, limit: number): Promise<INoteModel[] | null>;
  getNotesByUser(userId: string): Promise<INoteModel[] | null>;
};
