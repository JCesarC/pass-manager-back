import express from 'express';

import oauthRouter from './OAuth';

import { AuthHandler } from '../handlers';
import { checkLoggedIn } from '../../../middlewares';

const authRouter = express.Router();

const authHandler = new AuthHandler();

authRouter.post('/register', authHandler.registerHandler);

authRouter.use('/login', authHandler.loginHandler);
authRouter.use('/user', checkLoggedIn, authHandler.getauthUserDataHandler);
authRouter.use('/oauth', oauthRouter);

export default authRouter;
