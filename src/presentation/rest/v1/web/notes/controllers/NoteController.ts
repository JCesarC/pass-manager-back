import { inject, injectable } from 'inversify';
import { Get, Query, Route, Tags, Post, Body, Path } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';

import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';
import { INoteController, INoteModel } from '../../../../../../domain/notes/interfaces';
import { AllNotesResponseType } from '../../../../../../domain/notes/types';
import { CreateNoteUseCase, GetAllNotesUseCase, GetNotesByUserUseCase } from '../../../../../../application/notes/UseCases';

@Route('/api/v1/notes')
@Tags('NoteController')
@injectable()
export class NoteController implements INoteController{
  private noteRepository: INoteRepository;

  constructor (@inject(TYPES.INoteRepository) noteRepository: INoteRepository) {
    this.noteRepository = noteRepository;
  }
  @Get('/')
  async getAllNotes(@Query()page: number, @Query()limit: number): Promise<AllNotesResponseType> {
    const getAllNotesUseCase = new GetAllNotesUseCase(this.noteRepository);
    return getAllNotesUseCase.exec(page, limit);
  }

  @Get('/:userId')
  async getNotesByUser(@Path() userId: string): Promise<INoteModel[] | null> {
    const getNotesByUserUseCase = new GetNotesByUserUseCase(this.noteRepository);
    return getNotesByUserUseCase.exec(userId);
  }

  @Post('/')
  async createNote(@Body()noteData: INoteModel): Promise<INoteModel> {
    const createNoteUseCase = new CreateNoteUseCase(this.noteRepository);
    return createNoteUseCase.exec(noteData);
  }

}
