import express from 'express';

import { UserController } from '../controllers';
import { asyncHandler } from '../../../../shared';
import { getAuthUserId } from '../../../../middlewares';

const userRouter = express.Router();

userRouter.get('/me', asyncHandler(async (req, res) => {
  const user = await new UserController().getMe(getAuthUserId(req));
  res.status(200).json({ user });
}));

export default userRouter;
