import { IUpdateNoteByIdUseCase } from '../../../domain/notes/IUseCases';
import { INoteModel } from '../../../domain/notes/interfaces';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';
import { NotFoundError } from '../../shared';

export class UpdateNoteByIdUseCase implements IUpdateNoteByIdUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async exec(ownerId: string, noteId: string, changes: Partial<INoteModel>): Promise<INoteModel> {
    const note = await this.noteRepository.updateOwned(noteId, ownerId, changes);
    if (!note) throw new NotFoundError('Note');
    return note;
  }
}
