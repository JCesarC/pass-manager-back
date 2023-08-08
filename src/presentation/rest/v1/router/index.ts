import express from 'express';

import userRouter from '../web/users/router';
import authRouter from '../web/auth/router';
import uploadRouter from '../web/upload/router';
import vaultRouter from '../web/vaults/router';

const v1Router = express.Router();

// mainRooter.use('/hello', helloRouter);
v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/upload', uploadRouter);
v1Router.use('/vaults', vaultRouter);

export default v1Router;
