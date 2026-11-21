import { AllNotesResponseType } from '../types';
import { INoteModel } from './INoteModel';

export interface INoteController {
  getAllNotes(page: number, limit: number, ownerId: string): Promise<AllNotesResponseType>;
  getNoteById(id: string, ownerId: string): Promise<INoteModel>;
  createNote(noteData: unknown, ownerId: string): Promise<INoteModel>;
  updateNoteById(id: string, noteData: unknown, ownerId: string): Promise<INoteModel>;
  deleteNoteById(id: string, ownerId: string): Promise<void>;
}
