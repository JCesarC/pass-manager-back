import { INoteModel } from '../interfaces';

export interface IUpdateNoteByIdUseCase {
  exec(noteId: string, noteData: INoteModel): Promise<INoteModel | null>
}
