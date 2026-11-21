import { Request, Response } from 'express';
import passport from 'passport';

import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';
import { IGoogleProfile } from '../../../../../../domain/auth/models/IGoogleProfileModel';
import { UnauthorizedError } from '../../../../../../application/shared';
import { asyncHandler } from '../../../../shared';

import { AuthController } from '../controller/AuthController';

export class OAuthHandler {

  public googleAuthenticationHandler = passport.authenticate('google', {
    scope: ['email', 'profile'],
  });

  public googleCallbackHandler = passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/oauth/failure',
    session: false,
  });

  public googleSuccessCallbackHandler = asyncHandler(async (req, res) => {
    const authController = new AuthController(new UserRepository());
    const profile = req.user as IGoogleProfile;

    const token = await authController.generateAuthToken(profile._json.email);

    res.redirect(`http://localhost:3000/auth/login?token=${token}`);
  });

  public googleFailureHandler(_req: Request, _res: Response) {
    throw new UnauthorizedError('Google sign-in failed.');
  }

  public googleLogoutHandler(_req: Request, res: Response) {
    res.redirect('/');
  }

}
