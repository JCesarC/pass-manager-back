import { Request, Response } from 'express';

import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';

import { NoteController } from '../controllers';

import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

export class NoteHandler {

  async getAllNotes(req: Request, res: Response) {
    try {
      const noteRepository = iocContainer.get<INoteRepository>(TYPES.INoteRepository);
      const noteController = new NoteController(noteRepository);

      const page = req?.query?.page as string || '1';
      const limit = req?.query?.limit as string || '5';

      const intPage = parseInt(page);
      const intLimit = parseInt(limit);

      const response = await noteController.getAllNotes(intPage, intLimit);
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }

  async getNotesByUser(req: Request, res: Response) {
    try {
      const noteRepository = iocContainer.get<INoteRepository>(TYPES.INoteRepository);
      const { userId } = req.params;
      console.log('userId: ', userId);
      const noteController = new NoteController(noteRepository);
      const userNotes = await noteController.getNotesByUser(userId);
      return res.send(userNotes);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }

  async createNote(req: Request, res: Response) {
    try {
      const noteRepository = iocContainer.get<INoteRepository>(TYPES.INoteRepository);
      const noteController = new NoteController(noteRepository);
      const response = await noteController.createNote(req.body);
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }

  async updateNoteById(req: Request, res: Response) {
    try {
      const noteRepository = iocContainer.get<INoteRepository>(TYPES.INoteRepository);
      const noteController = new NoteController(noteRepository);
      const { id } = req.params;
      const noteData = req.body;

      const response = await noteController.updateNoteById(id, noteData);
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }
}
