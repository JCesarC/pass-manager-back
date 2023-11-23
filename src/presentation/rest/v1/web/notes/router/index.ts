import * as express from 'express';

import { NoteHandler } from '../handlers/NoteHandler';

const noteRouter = express.Router();

const noteHandler = new NoteHandler();

noteRouter.get('/', noteHandler.getAllNotes);
noteRouter.get('/:userId', noteHandler.getNotesByUser);
noteRouter.post('/', noteHandler.createNote);

export default noteRouter;
