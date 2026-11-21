import express from 'express';
import { UserController } from '../controllers';
import { asyncHandler, getPaginationQueries } from '../../../../shared';

const userRouter = express.Router();

userRouter.get('/', asyncHandler(async (req, res) => {
  const { page, limit } = getPaginationQueries(req);
  const dataUsers = await new UserController().getUsers(page, limit);
  res.status(200).json(dataUsers);
}));

export default userRouter;
