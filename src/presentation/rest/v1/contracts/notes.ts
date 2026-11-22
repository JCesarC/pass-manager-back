import { INoteModel } from '../../../../domain/notes/interfaces';

type NoteDocument = INoteModel & { createdAt?: Date; updatedAt?: Date };

export interface Note {
  _id: string;
  user: string;
  title: string;
  body?: string;
  isFavorite: boolean;
  isArchived: boolean;
  tags: string[];
  imageURLs: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotePage {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

export const presentNote = (note: NoteDocument): Note => ({
  _id: String(note._id),
  user: String(note.user),
  title: note.title,
  body: note.body,
  isFavorite: Boolean(note.isFavorite),
  isArchived: Boolean(note.isArchived),
  tags: note.tags ?? [],
  imageURLs: note.imageURLs ?? [],
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
});
