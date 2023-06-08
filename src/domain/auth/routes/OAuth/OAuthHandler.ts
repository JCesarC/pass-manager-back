import { Request, Response } from 'express';
import passport from 'passport';

import { AuthController } from '../../services/AuthController';

export const googleAuthenticationHandler = passport.authenticate('google', {
  scope: ['email', 'profile'],
});

export const googleCallbackHandler = passport.authenticate('google', {
  failureRedirect: '/api/auth/oauth/failure',
  session: false,
});

export const googleSucessCallbackHandler = async (req: any, res: Response) => {
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
};

export const googleFailureHandler = (req: Request, res: Response) => {
  try {
    return res.send('Failed to log in!');
  } catch (error) {
    return res.status(400).send({
      error: true,
      errorMessage: `${error}`,
    });
  }
};

export const googleLogoutHandler = (req: Request, res: Response) => {
  try {
    return res.redirect('/');
  } catch (error) {
    return res.status(400).send({
      error: true,
      errorMessage: `${error}`,
    });
  }
};
