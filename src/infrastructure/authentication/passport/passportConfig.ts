import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthController } from '../../../presentation/rest/v1/web/auth/controller/AuthController';

const config = {
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  PROXY: (process.env.USE_PROXY as string === 'true')
};

const AUTH_OPTIONS = {
  callbackURL: '/api/auth/oauth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  proxy: config.PROXY
};

const verifyCallback = async (accessToken: any, refreshToken: any, profile: any, done: any) => {
  try {
    const authController = new AuthController();
    await authController.signInByGoogle(profile);
    return done(null, profile);
  } catch (error) {
    return done(error, false);
  }
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

export default passport;
