import express, { Router } from 'express';

import { checkLoggedIn } from '../../../../middlewares/Auth';

import { authUserRouterHandler } from './AuthUserHandler';

const userRouter: Router = express.Router();

userRouter.get('/', checkLoggedIn, authUserRouterHandler);

export default userRouter;
