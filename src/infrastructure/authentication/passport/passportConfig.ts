import passport from 'passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { SignInWithGoogleUseCase } from '../../../application/auth/UseCases';
import { UnauthorizedError } from '../../../application/shared';
import { IGoogleProfile } from '../../../domain/auth/models/IGoogleProfileModel';
import { UserRepository } from '../../persistance/mongoose/database/users/repository/UserRepository';
import { env, isGoogleAuthEnabled } from '../../shared/config';
import { logger } from '../../shared/logger';

export interface GoogleSignInResult {
  userId: string;
}

const AUTH_OPTIONS = {
  callbackURL: '/api/v1/auth/oauth/google/callback',
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  proxy: env.USE_PROXY,
};

const verifyCallback = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  try {
    const userId = await new SignInWithGoogleUseCase(new UserRepository()).execute(
      profile as unknown as IGoogleProfile,
    );
    const result: GoogleSignInResult = { userId };
    return done(null, result);
  } catch (error) {
    if (error instanceof UnauthorizedError) return done(null, false);
    return done(error as Error);
  }
};

if (isGoogleAuthEnabled) {
  passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));
} else {
  logger.warn('Google OAuth is disabled: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not set.');
}

export default passport;
