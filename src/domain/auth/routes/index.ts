import express from 'express';
import registerRoute from './RegisterRouter';
import loginRouter from './LoginRouter';
import oauthRouter from './OAuthRouter';
import userRouter from './AuthUserRouter';

const authRouter = express.Router();

authRouter.use('/register', registerRoute);
authRouter.use('/login', loginRouter);
authRouter.use('/oauth', oauthRouter);
authRouter.use('/user', userRouter);

export default authRouter;
