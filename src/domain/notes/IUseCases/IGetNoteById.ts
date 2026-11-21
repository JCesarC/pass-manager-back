import { INoteModel } from '../interfaces';

export interface IGetNoteByIdUseCase {
  exec(ownerId: string, noteId: string): Promise<INoteModel>;
}
