import express from 'express';
import registerRoute from './RegisterRouter';
import loginRouter from './LoginRouter';

const authRouter = express.Router();

authRouter.use('/register', registerRoute);
authRouter.use('/login', loginRouter);

export default authRouter;
