import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

import { NoteController } from '../controllers';
import { asyncHandler, getPaginationQueries } from '../../../../shared';

const buildController = () =>
  new NoteController(iocContainer.get<INoteRepository>(TYPES.INoteRepository));

export class NoteHandler {

  getAllNotes = asyncHandler(async (req, res) => {
    const { page, limit } = getPaginationQueries(req);
    const response = await buildController().getAllNotes(page, limit);
    res.status(200).json(response);
  });

  getNotesByUser = asyncHandler(async (req, res) => {
    const userNotes = await buildController().getNotesByUser(req.params.userId);
    res.status(200).json(userNotes);
  });

  createNote = asyncHandler(async (req, res) => {
    const response = await buildController().createNote(req.body);
    res.status(201).json(response);
  });

  deleteNoteById = asyncHandler(async (req, res) => {
    await buildController().deleteNoteById(req.params.id);
    res.status(204).end();
  });

  updateNoteById = asyncHandler(async (req, res) => {
    const response = await buildController().updateNoteById(req.params.id, req.body);
    res.status(200).json(response);
  });
}
