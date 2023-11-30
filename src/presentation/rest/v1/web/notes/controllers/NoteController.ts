import { inject, injectable } from 'inversify';
import { Get, Query, Route, Tags, Post, Body, Path, Example, Put } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';

import { AllNotesResponseType } from '../../../../../../domain/notes/types';
import { INoteController, INoteModel } from '../../../../../../domain/notes/interfaces';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';
import { CreateNoteUseCase, GetAllNotesUseCase, GetNotesByUserUseCase, UpdateNoteByIdUseCase } from '../../../../../../application/notes/UseCases';

import { ThrowValidatorError } from '../../../../../../application/shared';
import { noteValidator } from '../../../../../../application/notes/NoteValidator';

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

  @Post('/')
  async createNote(@Body()noteData: INoteModel): Promise<INoteModel> {
    const createNoteUseCase = new CreateNoteUseCase(this.noteRepository);

    const { error, value } = noteValidator.validate(noteData);

    if (error) return ThrowValidatorError(error);
    return createNoteUseCase.exec(value);
  }

  @Put('/:id')
  async updateNoteById(@Path() id: string, @Body()noteData: INoteModel){
    const updateNoteById = new UpdateNoteByIdUseCase(this.noteRepository);
    return updateNoteById.exec(id, noteData);
  }

  @Get('/user/:userId')
  async getNotesByUser(@Path() userId: string): Promise<INoteModel[] | null> {
    const getNotesByUserUseCase = new GetNotesByUserUseCase(this.noteRepository);
    return getNotesByUserUseCase.exec(userId);
  }
}
