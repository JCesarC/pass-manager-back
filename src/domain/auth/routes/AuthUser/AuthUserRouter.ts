import express, { Router } from 'express';

import { checkLoggedIn } from '../../../../presentation/rest/v1/middlewares/AuthenticationMiddleware';

import { authUserRouterHandler } from './AuthUserHandler';

const userRouter: Router = express.Router();

userRouter.get('/', checkLoggedIn, authUserRouterHandler);

export default userRouter;
