import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

const config = {
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1 as string,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2 as string,
  PROXY: (process.env.USE_PROXY as string === 'true')
};

const AUTH_OPTIONS = {
  callbackURL: '/api/auth/oauth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  proxy: config.PROXY
};

const verifyCallback = (accessToken: any, refreshToken: any, profile: any, done: any) => {
  console.log('Google profile', JSON.stringify(profile));
  done(null, profile);
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

export default passport;
