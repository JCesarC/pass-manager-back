import express, { Request, Response } from 'express';
import { uploadHandler } from '../handlers';

const uploadRouter = express.Router();

uploadRouter.route('/').post((req: Request, res: Response) => {
  uploadHandler(req, res, 'test');
});

export default uploadRouter;
