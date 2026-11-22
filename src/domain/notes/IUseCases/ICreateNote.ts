import { INoteModel } from '../interfaces';

export interface ICreateNoteUseCase {
  exec(ownerId: string, noteData: Partial<INoteModel>): Promise<INoteModel>;
}
