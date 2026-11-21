import { IDeleteNoteById } from '../../../domain/notes/IUseCases';

import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';

export class DeleteNoteByIdUseCase implements IDeleteNoteById {
  private noteRepository: INoteRepository;
  constructor(noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }
  async exec(id: string): Promise<unknown> {
    const response = await this.noteRepository.delete(id);
    return response;
  }

}
