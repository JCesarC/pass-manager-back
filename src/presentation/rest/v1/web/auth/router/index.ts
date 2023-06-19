import express from 'express';
import { AuthHandler } from '../handlers';
import oauthRouter from './OAuth';

const authRouter = express.Router();

const authHandler = new AuthHandler();

authRouter.post('/register', authHandler.registerHandler);

authRouter.use('/login', authHandler.loginHandler);
authRouter.use('/user', authHandler.getauthUserDataHandler);
authRouter.use('/oauth', oauthRouter);

export default authRouter;
