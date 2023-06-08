import express, { Router } from 'express';
import { googleAuthenticationHandler, googleCallbackHandler, googleFailureHandler, googleLogoutHandler, googleSucessCallbackHandler } from './OAuthHandler';

const oauthRouter: Router = express.Router();

oauthRouter
  .get(
    '/google',
    googleAuthenticationHandler
  )
  .get(
    '/google/callback',
    googleCallbackHandler,
    googleSucessCallbackHandler,
  )
  .get(
    '/failure',
    googleFailureHandler
  )
  .get(
    '/logout',
    googleLogoutHandler
  );

export default oauthRouter;
