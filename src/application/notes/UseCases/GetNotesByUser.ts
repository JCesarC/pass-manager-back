import { INoteModel } from '../../../domain/notes/interfaces';

import { IGetNotesByUserUseCase } from '../../../domain/notes/IUseCases';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';

export class GetNotesByUserUseCase implements IGetNotesByUserUseCase {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async exec(userId: string): Promise<INoteModel[] | null> {
    const userNotes = await this.noteRepository.getNotesByUser(userId);
    return userNotes;
  }

}
