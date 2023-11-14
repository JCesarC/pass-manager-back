import * as express from 'express';

import { FieldHandler } from '../handlers/FieldHandler';

const fieldRouter = express.Router();

const fieldHandler = new FieldHandler();

fieldRouter.get('/', fieldHandler.getAllFields);
fieldRouter.post('/', fieldHandler.createField);

export default fieldRouter;
