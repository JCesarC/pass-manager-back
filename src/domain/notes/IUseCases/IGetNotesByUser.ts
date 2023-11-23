import { INoteModel } from '../interfaces';

export interface IGetNotesByUserUseCase {
  exec(userId: string): Promise<INoteModel[] | null>
}
