import { AllNotesResponseType } from '../../../domain/notes/types';

import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';
import { IGetAllNotesUseCase } from '../../../domain/notes/IUseCases';

export class GetAllNotesUseCase implements IGetAllNotesUseCase {
  private noteRepository: INoteRepository;

  constructor(noteRepository: INoteRepository){
    this.noteRepository = noteRepository;
  }

  async exec(page: number, limit: number): Promise<AllNotesResponseType> {
    const notes = await this.noteRepository.getDocumentsPaginated(page, limit);
    const total = await this.noteRepository.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const response = {
      notes: notes || [],
      totalPages,
      currentPage: page,
    };
    return response;
  }

}
