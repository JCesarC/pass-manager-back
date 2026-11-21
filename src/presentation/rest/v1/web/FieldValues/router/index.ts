import * as express from 'express';

import { FieldValueHandler } from '../handlers/FieldValueHandler';

const fieldValueRouter = express.Router();

const fieldValueHandler = new FieldValueHandler();

fieldValueRouter.post('/', fieldValueHandler.createFieldValue);

export default fieldValueRouter;
