import express from 'express';
import registerRoute from './RegisterRouter';

const authRouter = express.Router();

authRouter.use('/register', registerRoute);

export default authRouter;
