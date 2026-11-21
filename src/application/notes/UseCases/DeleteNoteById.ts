import { IDeleteNoteById } from '../../../domain/notes/IUseCases';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';
import { NotFoundError } from '../../shared';

export class DeleteNoteByIdUseCase implements IDeleteNoteById {
  constructor(private readonly noteRepository: INoteRepository) {}

  async exec(ownerId: string, noteId: string): Promise<void> {
    const deleted = await this.noteRepository.deleteOwned(noteId, ownerId);
    if (!deleted) throw new NotFoundError('Note');
  }
}
