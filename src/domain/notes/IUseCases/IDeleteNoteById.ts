export interface IDeleteNoteById {
  exec(id: string): Promise<unknown>;
}
