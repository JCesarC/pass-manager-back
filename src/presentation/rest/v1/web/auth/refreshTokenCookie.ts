import { CookieOptions, Request, Response } from 'express';

import { env } from '../../../../../infrastructure/shared/config';

export const REFRESH_TOKEN_COOKIE = 'pm_refresh_token';

/**
 * The refresh token is never readable by JavaScript (httpOnly) and is only
 * sent to the auth endpoints that need it (path), which limits its exposure.
 */
const baseOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  path: '/api/v1/auth',
});

export const setRefreshTokenCookie = (res: Response, token: string, expiresAt: Date) => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, { ...baseOptions(), expires: expiresAt });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, baseOptions());
};

export const readRefreshTokenCookie = (req: Request): string | undefined => {
  const value = req.cookies?.[REFRESH_TOKEN_COOKIE];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
};
