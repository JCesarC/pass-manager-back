import express, { Router } from 'express';
import { loginHandler } from './LoginHandler';

const loginRouter: Router = express.Router();

loginRouter.post('/', loginHandler);

export default loginRouter;
