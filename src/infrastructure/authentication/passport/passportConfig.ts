import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthController } from '../../../presentation/rest/v1/web/auth/controller/AuthController';
import { UserRepository } from '../../persistance/mongoose/database/users/repository/UserRepository';
import { env, isGoogleAuthEnabled } from '../../shared/config';

const AUTH_OPTIONS = {
  callbackURL: '/api/v1/auth/oauth/google/callback',
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  proxy: env.USE_PROXY
};

const verifyCallback = async (accessToken: any, refreshToken: any, profile: any, done: any) => {
  try {
    const userRepository = new UserRepository();

    const authController = new AuthController(userRepository);
    await authController.signInByGoogle(profile);
    return done(null, profile);
  } catch (error) {
    return done(error, false);
  }
};

if (isGoogleAuthEnabled) {
  passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));
} else {
  console.warn('Google OAuth is disabled: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set.');
}

export default passport;
