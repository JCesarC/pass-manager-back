import express, { Request, Response } from 'express';
import { uploadHandler } from '../handlers';

const uploadRouter = express.Router();

uploadRouter.route('/').post((req: Request, res: Response) => {
  uploadHandler(req, res, 'test');
});

uploadRouter.route('/notes').post((req: Request, res: Response) => {
  uploadHandler(req, res, 'notes');
});

export default uploadRouter;
