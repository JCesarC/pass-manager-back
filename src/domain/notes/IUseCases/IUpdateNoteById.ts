import { INoteModel } from '../interfaces';

export interface IUpdateNoteByIdUseCase {
  exec(ownerId: string, noteId: string, changes: Partial<INoteModel>): Promise<INoteModel>;
}
