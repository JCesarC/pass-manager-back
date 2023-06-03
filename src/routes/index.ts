import express, { Request, Response } from 'express';
import userRouter from '../Collections/users/routes/UserRouter';
import authRouter from '../domain/auth/routes/AuthRouter';

const mainRooter = express.Router();

// mainRooter.use('/hello', helloRouter);
mainRooter.use('/users', userRouter);
mainRooter.use('/auth', authRouter);

export default mainRooter;
