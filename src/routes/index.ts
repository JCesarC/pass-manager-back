import express, { Request, Response } from 'express';

import helloRouter from '../hello/services/routes/hello.router';
import { LogInfo } from '../utils/logger';

const mainRooter = express.Router();

mainRooter.use('/hello', helloRouter);

export default mainRooter;
