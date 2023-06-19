import express from 'express';

import userRouter from '../../../../Collections/users/routes/UserRouter';
import authRouter from '../web/auth/router';
import uploadRouter from '../web/upload/router';

const v1Router = express.Router();

// mainRooter.use('/hello', helloRouter);
v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/upload', uploadRouter);

export default v1Router;
