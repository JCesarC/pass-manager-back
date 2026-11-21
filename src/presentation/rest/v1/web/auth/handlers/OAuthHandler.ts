import { Request, Response } from 'express';
import passport from 'passport';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

import { AuthController } from '../controller/AuthController';

export class OAuthHandler {

  public googleAuthenticationHandler = passport.authenticate('google', {
    scope: ['email', 'profile'],
  });

  public googleCallbackHandler = passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/oauth/failure',
    session: false,
  });

  public async googleSuccessCallbackHandler(req: any, res: Response) {
    try {
      const userRepository = new UserRepository();
      const authController = new AuthController(userRepository);

      const token = await authController.generateAuthToken(req.user._json.email);

      res.redirect(`http://localhost:3000/auth/login?token=${token}`);
    } catch (error: any) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error?.message}`,
      });
    }
  };

  public async googleFailureHandler(req: Request, res: Response){
    try {
      return res.send('Failed to log in!');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  };

  public googleLogoutHandler(req: Request, res: Response) {
    try {
      return res.redirect('/');
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  };

}
