import { INoteModel } from '../../../domain/notes/interfaces';

import { ICreateNoteUseCase } from '../../../domain/notes/IUseCases';
import { INoteRepository } from '../../../domain/notes/repository/INoteRepository';

export class CreateNoteUseCase implements ICreateNoteUseCase{
  private noteRepository: INoteRepository;

  constructor (noteRepository: INoteRepository){
    this.noteRepository = noteRepository;
  }

  async exec(noteData: INoteModel): Promise<INoteModel> {
    return this.noteRepository.create(noteData);
  }

}
