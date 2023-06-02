import express, { Request, Response } from 'express';
import { UserController } from '../services/UserController';

const userRouter = express.Router();

userRouter.route('/').get(async (req: Request, res: Response) => {
  try {
    const userController = new UserController();

    const page = req?.query?.page as string || '1';
    const limit = req?.query?.limit as string || '5';

    const intPage = parseInt(page);
    const intLimit = parseInt(limit);

    const dataUsers = await userController.getUsers(intPage, intLimit);

    return res.send(dataUsers);

  } catch (error) {
    return res.status(500).send({ Error: error });
  }
});

export default userRouter;
