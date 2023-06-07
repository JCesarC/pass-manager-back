import express, { Router } from 'express';
import passport from 'passport';
import { AuthController } from '../services/AuthController';

const oauthRouter: Router = express.Router();

oauthRouter
  .get(
    '/google',
    passport.authenticate('google', {
      scope: ['email', 'profile'],
    }),
  )
  .get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/oauth/failure',
      session: false,
    }),
    async (req: any, res, next) => {
      try {
        const authController = new AuthController();
        const token = await authController.generateAuthToken(req.user._json.email);

        res.redirect(`http://localhost:3000/auth/login?token=${token}`);
      } catch (error: any) {
        return res.status(400).send({
          error: true,
          errorMessage: `${error?.message}`,
        });
      }
    },
  )
  .get('/failure', async (req: any, res: any) => {
    try {
      return res.send('Failed to log in!');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  })
  .get('/logout', async (req: any, res: any) => {
    try {
      return res.redirect('/');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  });

export default oauthRouter;
