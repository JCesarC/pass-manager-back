import { inject, injectable } from 'inversify';
import { Get, Query, Route, Tags, Post, Body, Path, Put, Delete } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';

import { AllNotesResponseType } from '../../../../../../domain/notes/types';
import { INoteController, INoteModel } from '../../../../../../domain/notes/interfaces';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';
import {
  CreateNoteUseCase,
  DeleteNoteByIdUseCase,
  GetAllNotesUseCase,
  GetNotesByUserUseCase,
  UpdateNoteByIdUseCase,
} from '../../../../../../application/notes/UseCases';

import { NotFoundError, validate } from '../../../../../../application/shared';
import { noteUpdateValidator, noteValidator } from '../../../../../../application/notes/NoteValidator';

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

    const note = validate(noteValidator, noteData) as INoteModel;

    return createNoteUseCase.exec(note);
  }

  @Delete('/:id')
  async deleteNoteById(@Path() id: string): Promise<void> {
    const deleteNoteByIdUseCase = new DeleteNoteByIdUseCase(this.noteRepository);
    const deleted = await deleteNoteByIdUseCase.exec(id);
    if (!deleted) throw new NotFoundError('Note');
  }

  @Put('/:id')
  async updateNoteById(@Path() id: string, @Body()noteData: INoteModel){
    const updateNoteById = new UpdateNoteByIdUseCase(this.noteRepository);
    const changes = validate(noteUpdateValidator, noteData) as INoteModel;
    const note = await updateNoteById.exec(id, changes);
    if (!note) throw new NotFoundError('Note');
    return note;
  }

  @Get('/user/:userId')
  async getNotesByUser(@Path() userId: string): Promise<INoteModel[] | null> {
    const getNotesByUserUseCase = new GetNotesByUserUseCase(this.noteRepository);
    return getNotesByUserUseCase.exec(userId);
  }
}
