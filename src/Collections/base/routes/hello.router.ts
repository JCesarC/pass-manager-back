import express, { Request, Response } from 'express';
import { LogInfo } from '../../../utils/logger';

const helloRouter = express.Router();

helloRouter.route('/').get(async (req: Request, res: Response) => {
  const name: any = req?.query?.name;
  LogInfo(`Query param: ${name}`);
  const helloMessage = `Hello ${name || 'World'}`;
  return res.send(helloMessage);
});

export default helloRouter;
