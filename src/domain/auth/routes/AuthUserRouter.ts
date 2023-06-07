import express, { Request, Response, Router } from 'express';
import { checkLoggedIn } from '../../../middlewares/Auth';
import { UserController } from '../../../Collections/users/services/UserController';
import { IUserResponseModel } from '../../../Collections/users/models';

const userRouter: Router = express.Router();

userRouter.get('/', checkLoggedIn, async (req: Request, res: Response) => {
  try {
    const userController = new UserController();

    const { _id = '' } = req.user as IUserResponseModel;
    const user = await userController.getUserData(_id);
    if (!user) throw new Error(`Cannot find user with id: ${_id}`);
    return res.send({
      error: false,
      user
    });
  } catch (error: any) {
    return res.status(500).send({
      error: true,
      errorMessage: `${error?.message}`
    });
  }
});

export default userRouter;
