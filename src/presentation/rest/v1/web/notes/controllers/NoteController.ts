import { inject, injectable } from 'inversify';
import { Body, Delete, Get, Inject, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { AllNotesResponseType } from '../../../../../../domain/notes/types';
import { INoteController, INoteModel } from '../../../../../../domain/notes/interfaces';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

import {
  CreateNoteUseCase,
  DeleteNoteByIdUseCase,
  GetAllNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteByIdUseCase,
} from '../../../../../../application/notes/UseCases';
import { validate } from '../../../../../../application/shared';
import { noteUpdateValidator, noteValidator } from '../../../../../../application/notes/NoteValidator';

/**
 * Every operation is scoped to the authenticated user (ownerId comes from
 * the access token). Notes of other users behave as if they did not exist.
 */
@Route('/api/v1/notes')
@Tags('NoteController')
@Security('bearer')
@injectable()
export class NoteController implements INoteController {
  constructor(@inject(TYPES.INoteRepository) private readonly noteRepository: INoteRepository) {}

  /** Notes of the authenticated user, newest first. */
  @Get('/')
  async getAllNotes(
    @Query() page: number,
    @Query() limit: number,
    @Inject() ownerId: string,
  ): Promise<AllNotesResponseType> {
    return new GetAllNotesUseCase(this.noteRepository).exec(ownerId, page, limit);
  }

  @Get('/{id}')
  async getNoteById(@Path() id: string, @Inject() ownerId: string): Promise<INoteModel> {
    return new GetNoteByIdUseCase(this.noteRepository).exec(ownerId, id);
  }

  @Post('/')
  async createNote(@Body() noteData: Partial<INoteModel>, @Inject() ownerId: string): Promise<INoteModel> {
    const note = validate(noteValidator, noteData);
    return new CreateNoteUseCase(this.noteRepository).exec(ownerId, note);
  }

  @Put('/{id}')
  async updateNoteById(
    @Path() id: string,
    @Body() noteData: Partial<INoteModel>,
    @Inject() ownerId: string,
  ): Promise<INoteModel> {
    const changes = validate(noteUpdateValidator, noteData);
    return new UpdateNoteByIdUseCase(this.noteRepository).exec(ownerId, id, changes);
  }

  @Delete('/{id}')
  async deleteNoteById(@Path() id: string, @Inject() ownerId: string): Promise<void> {
    return new DeleteNoteByIdUseCase(this.noteRepository).exec(ownerId, id);
  }
}
