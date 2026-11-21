import passport from 'passport';

import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';
import { IOAuthCodeRepository } from '../../../../../../domain/auth/repository/IOAuthCodeRepository';
import { OAuthCodeService } from '../../../../../../application/auth/services/OAuthCodeService';
import { UnauthorizedError } from '../../../../../../application/shared';
import { env } from '../../../../../../infrastructure/shared/config';
import { GoogleSignInResult } from '../../../../../../infrastructure/authentication/passport/passportConfig';
import { asyncHandler } from '../../../../shared';

/** Where the front end receives the result of a social sign-in. */
const frontendCallbackUrl = (params: Record<string, string>) => {
  const url = new URL('/auth/callback', env.FRONTEND_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
};

export class OAuthHandler {

  public googleAuthenticationHandler = passport.authenticate('google', {
    scope: ['email', 'profile'],
    session: false,
  });

  public googleCallbackHandler = passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/oauth/failure',
    session: false,
  });

  /**
   * Redirects to the front end with a single-use code instead of a token, so
   * no credential ends up in the browser history, logs or Referer headers.
   */
  public googleSuccessCallbackHandler = asyncHandler(async (req, res) => {
    const result = req.user as GoogleSignInResult | undefined;
    if (!result?.userId) throw new UnauthorizedError('Google sign-in failed.');

    const code = await new OAuthCodeService(
      iocContainer.get<IOAuthCodeRepository>(TYPES.IOAuthCodeRepository),
    ).issue(result.userId);

    res.redirect(frontendCallbackUrl({ code }));
  });

  public googleFailureHandler = asyncHandler(async (_req, res) => {
    res.redirect(frontendCallbackUrl({ error: 'google_sign_in_failed' }));
  });

}
