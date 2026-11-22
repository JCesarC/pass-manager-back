import express, { RequestHandler, Router } from 'express';
import { OAuthHandler } from '../../handlers';
import { AuthHandler } from '../../handlers/AuthHandler';
import { NotFoundError } from '../../../../../../../application/shared';
import { isGoogleAuthEnabled } from '../../../../../../../infrastructure/shared/config';

const requireGoogleAuth: RequestHandler = (_req, _res, next) =>
  next(isGoogleAuthEnabled ? undefined : new NotFoundError('Google sign-in'));

const oauthRouter: Router = express.Router();

const oAuthHandler = new OAuthHandler();
const authHandler = new AuthHandler();

oauthRouter
  .get('/google', requireGoogleAuth, oAuthHandler.googleAuthenticationHandler)
  .get(
    '/google/callback',
    requireGoogleAuth,
    oAuthHandler.googleCallbackHandler,
    oAuthHandler.googleSuccessCallbackHandler,
  )
  .get('/failure', oAuthHandler.googleFailureHandler)
  .post('/exchange', authHandler.oauthExchangeHandler);

export default oauthRouter;
