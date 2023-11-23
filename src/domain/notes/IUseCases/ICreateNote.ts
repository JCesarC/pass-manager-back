import { INoteModel } from '../interfaces';

export interface ICreateNoteUseCase {
  exec(noteData: INoteModel): Promise<INoteModel>;
}
