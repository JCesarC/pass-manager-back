import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

import { NoteController } from '../controllers';
import { asyncHandler, getPaginationQueries } from '../../../../shared';
import { getAuthUserId } from '../../../../middlewares';

const buildController = () =>
  new NoteController(iocContainer.get<INoteRepository>(TYPES.INoteRepository));

export class NoteHandler {

  getAllNotes = asyncHandler(async (req, res) => {
    const { page, limit } = getPaginationQueries(req);
    const response = await buildController().getAllNotes(page, limit, getAuthUserId(req));
    res.status(200).json(response);
  });

  getNoteById = asyncHandler(async (req, res) => {
    const note = await buildController().getNoteById(req.params.id, getAuthUserId(req));
    res.status(200).json(note);
  });

  createNote = asyncHandler(async (req, res) => {
    const response = await buildController().createNote(req.body, getAuthUserId(req));
    res.status(201).json(response);
  });

  updateNoteById = asyncHandler(async (req, res) => {
    const response = await buildController().updateNoteById(req.params.id, req.body, getAuthUserId(req));
    res.status(200).json(response);
  });

  deleteNoteById = asyncHandler(async (req, res) => {
    await buildController().deleteNoteById(req.params.id, getAuthUserId(req));
    res.status(204).end();
  });
}
