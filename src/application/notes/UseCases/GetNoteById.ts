import { IGetNoteByIdUseCase } from '../../../domain/notes/IUseCases';
import { INoteModel } from '../../../domain/notes/interfaces';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';
import { NotFoundError } from '../../shared';

export class GetNoteByIdUseCase implements IGetNoteByIdUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async exec(ownerId: string, noteId: string): Promise<INoteModel> {
    const note = await this.noteRepository.findOwnedById(noteId, ownerId);
    if (!note) throw new NotFoundError('Note');
    return note;
  }
}
