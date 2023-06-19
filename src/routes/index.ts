import express from 'express';
import userRouter from '../Collections/users/routes/UserRouter';
import authRouter from '../presentation/rest/v1/web/auth/router';
import uploadRouter from '../domain/upload/routes';

const mainRooter = express.Router();

// mainRooter.use('/hello', helloRouter);
mainRooter.use('/users', userRouter);
mainRooter.use('/auth', authRouter);
mainRooter.use('/upload', uploadRouter);

export default mainRooter;
