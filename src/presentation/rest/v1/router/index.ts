import express from 'express';

import userRouter from '../web/users/router';
import authRouter from '../web/auth/router';
import vaultRouter from '../web/vaults/router';
import fieldRouter from '../web/Fields/router';
import fieldValueRouter from '../web/FieldValues/router';
import noteRouter from '../web/notes/router';

import { authenticate, PublicRoute } from '../../middlewares';

export const PUBLIC_ROUTES: PublicRoute[] = [
  { method: 'POST', path: '/auth/register' },
  { method: 'POST', path: '/auth/login' },
  { method: 'POST', path: '/auth/refresh' },
  { method: 'POST', path: '/auth/logout' },
  { method: 'GET', path: '/auth/oauth/*' },
  { method: 'POST', path: '/auth/oauth/exchange' },
];

const v1Router = express.Router();

v1Router.use(authenticate(PUBLIC_ROUTES));

v1Router.use('/users', userRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/vaults', vaultRouter);
v1Router.use('/fields', fieldRouter);
v1Router.use('/fieldValues', fieldValueRouter);
v1Router.use('/notes', noteRouter);

export default v1Router;
