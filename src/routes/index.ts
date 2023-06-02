import express, { Request, Response } from 'express';
import userRouter from '../Collections/users/routes/UserRouter';

const mainRooter = express.Router();

// mainRooter.use('/hello', helloRouter);
mainRooter.use('/users', userRouter);

export default mainRooter;
