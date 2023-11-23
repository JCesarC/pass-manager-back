import { AllNotesResponseType } from '../types';
import { INoteModel } from './INoteModel';

export interface INoteController {
  getAllNotes(page: number, limit: number): Promise<AllNotesResponseType>
  getNotesByUser(userId: string): Promise<INoteModel[] | null>;
  createNote(noteData: INoteModel): Promise<INoteModel>;
}
