import * as express from 'express';

import { NoteHandler } from '../handlers/NoteHandler';
import { validateObjectIdParams } from '../../../../middlewares';

const noteRouter = express.Router();

const noteHandler = new NoteHandler();

noteRouter.get('/', noteHandler.getAllNotes);
noteRouter.post('/', noteHandler.createNote);
noteRouter.get('/:id', validateObjectIdParams('id'), noteHandler.getNoteById);
noteRouter.put('/:id', validateObjectIdParams('id'), noteHandler.updateNoteById);
noteRouter.delete('/:id', validateObjectIdParams('id'), noteHandler.deleteNoteById);

export default noteRouter;
