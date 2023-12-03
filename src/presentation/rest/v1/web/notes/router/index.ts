import * as express from 'express';

import { NoteHandler } from '../handlers/NoteHandler';

const noteRouter = express.Router();

const noteHandler = new NoteHandler();

noteRouter.get('/', noteHandler.getAllNotes);
noteRouter.post('/', noteHandler.createNote);
noteRouter.delete('/:id', noteHandler.deleteNoteById);
noteRouter.put('/:id', noteHandler.updateNoteById);
noteRouter.get('/user/:userId', noteHandler.getNotesByUser);
export default noteRouter;
