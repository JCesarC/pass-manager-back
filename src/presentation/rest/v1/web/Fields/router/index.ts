import * as express from 'express';

import { FieldHandler } from '../handlers/FieldHandler';

const fieldRouter = express.Router();

const fieldHandler = new FieldHandler();

fieldRouter.get('/', fieldHandler.getAllFields);

export default fieldRouter;
