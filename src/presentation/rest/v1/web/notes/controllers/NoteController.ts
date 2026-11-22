import { inject, injectable } from 'inversify';
import {
  Body,
  Delete,
  Example,
  Get,
  Inject,
  OperationId,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

import {
  CreateNoteUseCase,
  DeleteNoteByIdUseCase,
  GetAllNotesUseCase,
  GetNoteByIdUseCase,
  UpdateNoteByIdUseCase,
} from '../../../../../../application/notes/UseCases';
import { validate } from '../../../../../../application/shared';
import {
  NoteInput,
  NoteUpdateInput,
  noteUpdateValidator,
  noteValidator,
} from '../../../../../../application/notes/NoteValidator';

import { ErrorResponseBody, Note, NotePage, presentNote } from '../../../contracts';

@Route('/api/v1/notes')
@Tags('Notes')
@Security('bearer')
@injectable()
@Response<ErrorResponseBody>(400, 'Invalid id, query or body', {
  error: {
    code: 'VALIDATION_ERROR',
    message: 'The request is invalid.',
    details: [{ path: 'title', message: '"title" is required' }],
  },
})
@Response<ErrorResponseBody>(401, 'Missing, invalid or expired access token', {
  error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
})
export class NoteController {
  constructor(@inject(TYPES.INoteRepository) private readonly noteRepository: INoteRepository) {}

  /**
   * @summary List the authenticated user's notes, newest first
   * @param page Page number, starting at 1
   * @param limit Notes per page, up to 50
   * @isInt page
   * @minimum page 1
   * @isInt limit
   * @minimum limit 1
   * @maximum limit 50
   */
  @Get('/')
  @OperationId('listNotes')
  @Example<NotePage>({
    notes: [
      {
        _id: '6650f2c4b3c4d5e6f7a8b9d1',
        user: '6650f1a2b3c4d5e6f7a8b9c0',
        title: 'Wi-Fi at home',
        body: 'Router admin is on 192.168.0.1',
        isFavorite: false,
        isArchived: false,
        tags: ['home'],
        imageURLs: [],
      },
    ],
    totalPages: 1,
    currentPage: 1,
  })
  async getAllNotes(
    @Query() page = 1,
    @Query() limit = 10,
    @Inject() ownerId: string,
  ): Promise<NotePage> {
    const result = await new GetAllNotesUseCase(this.noteRepository).exec(ownerId, page, limit);
    return { ...result, notes: result.notes.map(presentNote) };
  }

  /**
   * @summary Get one of the authenticated user's notes
   */
  @Get('/{id}')
  @OperationId('getNote')
  @Response<ErrorResponseBody>(404, 'The note does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Note not found.' },
  })
  async getNoteById(@Path() id: string, @Inject() ownerId: string): Promise<Note> {
    return presentNote(await new GetNoteByIdUseCase(this.noteRepository).exec(ownerId, id));
  }

  /**
   * @summary Create a note owned by the authenticated user
   */
  @Post('/')
  @OperationId('createNote')
  @SuccessResponse(201, 'Note created')
  async createNote(@Body() noteData: NoteInput, @Inject() ownerId: string): Promise<Note> {
    const note = validate(noteValidator, noteData);
    return presentNote(await new CreateNoteUseCase(this.noteRepository).exec(ownerId, note));
  }

  /**
   * @summary Update one of the authenticated user's notes
   */
  @Put('/{id}')
  @OperationId('updateNote')
  @Response<ErrorResponseBody>(404, 'The note does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Note not found.' },
  })
  async updateNoteById(
    @Path() id: string,
    @Body() noteData: NoteUpdateInput,
    @Inject() ownerId: string,
  ): Promise<Note> {
    const changes = validate(noteUpdateValidator, noteData);
    return presentNote(await new UpdateNoteByIdUseCase(this.noteRepository).exec(ownerId, id, changes));
  }

  /**
   * @summary Delete one of the authenticated user's notes
   */
  @Delete('/{id}')
  @OperationId('deleteNote')
  @SuccessResponse(204, 'Note deleted')
  @Response<ErrorResponseBody>(404, 'The note does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Note not found.' },
  })
  async deleteNoteById(@Path() id: string, @Inject() ownerId: string): Promise<void> {
    return new DeleteNoteByIdUseCase(this.noteRepository).exec(ownerId, id);
  }
}
