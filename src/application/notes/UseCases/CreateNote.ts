import { INoteModel } from '../../../domain/notes/interfaces';
import { ICreateNoteUseCase } from '../../../domain/notes/IUseCases';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';

export class CreateNoteUseCase implements ICreateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async exec(ownerId: string, noteData: Partial<INoteModel>): Promise<INoteModel> {
    // The owner always comes from the authenticated user, never from the payload.
    return this.noteRepository.create({ ...noteData, user: ownerId } as unknown as INoteModel);
  }
}
