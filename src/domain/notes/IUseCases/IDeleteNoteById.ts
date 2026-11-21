export interface IDeleteNoteById {
  exec(ownerId: string, noteId: string): Promise<void>;
}
