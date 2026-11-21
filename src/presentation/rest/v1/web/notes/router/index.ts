import * as express from 'express';

import { NoteHandler } from '../handlers/NoteHandler';
import { validateObjectIdParams } from '../../../../middlewares';

const noteRouter = express.Router();

const noteHandler = new NoteHandler();

noteRouter.get('/', noteHandler.getAllNotes);
noteRouter.post('/', noteHandler.createNote);
noteRouter.delete('/:id', validateObjectIdParams('id'), noteHandler.deleteNoteById);
noteRouter.put('/:id', validateObjectIdParams('id'), noteHandler.updateNoteById);
noteRouter.get('/user/:userId', validateObjectIdParams('userId'), noteHandler.getNotesByUser);
export default noteRouter;
