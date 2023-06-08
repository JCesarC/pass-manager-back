import express from 'express';
import registerRoute from './Register/RegisterRouter';
import loginRouter from './Login/LoginRouter';
import oauthRouter from './OAuth/OAuthRouter';
import userRouter from './AuthUser/AuthUserRouter';

const authRouter = express.Router();

authRouter.use('/register', registerRoute);
authRouter.use('/login', loginRouter);
authRouter.use('/oauth', oauthRouter);
authRouter.use('/user', userRouter);

export default authRouter;
