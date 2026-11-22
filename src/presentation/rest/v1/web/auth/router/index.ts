import express from 'express';

import oauthRouter from './OAuth';

import { AuthHandler } from '../handlers';
import { requireTrustedOrigin } from '../../../../middlewares';

const authRouter = express.Router();

const authHandler = new AuthHandler();

authRouter.use(requireTrustedOrigin);

authRouter.post('/register', authHandler.registerHandler);

authRouter.post('/login', authHandler.loginHandler);
authRouter.post('/refresh', authHandler.refreshHandler);
authRouter.post('/logout', authHandler.logoutHandler);
authRouter.use('/oauth', oauthRouter);

export default authRouter;
