import { AllNotesResponseType } from '../../../domain/notes/types';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';
import { IGetAllNotesUseCase } from '../../../domain/notes/IUseCases';

export class GetAllNotesUseCase implements IGetAllNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async exec(ownerId: string, page: number, limit: number): Promise<AllNotesResponseType> {
    const [notes, total] = await Promise.all([
      this.noteRepository.findOwnedPaginated(ownerId, page, limit),
      this.noteRepository.countOwned(ownerId),
    ]);

    return {
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
