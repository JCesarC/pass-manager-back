import { IUpdateNoteByIdUseCase } from '../../../domain/notes/IUseCases';

import { INoteModel } from '../../../domain/notes/interfaces';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';

export class UpdateNoteByIdUseCase implements IUpdateNoteByIdUseCase {
  private noteRepository: INoteRepository;

  constructor (noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }

  async exec(noteId: string, noteData: INoteModel): Promise<INoteModel | null> {
    const noteUpdated = await this.noteRepository.update(noteId, noteData);
    return noteUpdated;
  }

}
