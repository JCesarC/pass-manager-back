import express, { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import { generateToken } from '../../../utils/AuthUtils';
import { checkLoggedIn } from '../../../middlewares/Auth';
import { IUserResponseModel } from '../../../Collections/users/models';
import { UserController } from '../../../Collections/users/services/UserController';

const firstMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Realizar alguna lógica antes de pasar al siguiente middleware o controlador
  console.log('Middleware 1');
  next();
};

const oauthRouter: Router = express.Router();

oauthRouter
  .get(
    '/google',
    firstMiddleware,
    passport.authenticate('google', {
      scope: ['email', 'profile'],
    }),
  )
  .get(
    '/google/callback',
    firstMiddleware,
    passport.authenticate('google', {
      failureRedirect: '/api/auth/oauth/failure',
      session: false,
    }),
    (req: any, res, next) => {
      console.log('req.user: ', req.user);
      const token = generateToken(req.user._id, req.user.email);

      res.cookie('user', req.user);
      res.redirect(`http://localhost:3000/auth/login?token=${token}`);
    },
  )
  .get('/failure', firstMiddleware, async (req: any, res: any) => {
    try {
      console.log('inside failure to login');
      return res.send('Failed to log in!');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  })
  .get('/logout', firstMiddleware, async (req: any, res: any) => {
    try {
      console.log('inside logout');
      return res.redirect('/');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  });

export default oauthRouter;
