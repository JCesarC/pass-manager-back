import express, { Router } from 'express';
import { OAuthHandler } from '../../handlers';

const oauthRouter: Router = express.Router();

const oAuthHandler = new OAuthHandler();

oauthRouter
  .get('/google', oAuthHandler.googleAuthenticationHandler)
  .get(
    '/google/callback',
    oAuthHandler.googleCallbackHandler,
    oAuthHandler.googleSuccessCallbackHandler,
  )
  .get('/failure', oAuthHandler.googleFailureHandler)
  .get('/logout', oAuthHandler.googleLogoutHandler);

export default oauthRouter;
