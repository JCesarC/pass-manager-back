import { INoteModel } from '../interfaces';

export type AllNotesResponseType = {
  notes: INoteModel[],
  totalPages: number,
  currentPage: number,
}
