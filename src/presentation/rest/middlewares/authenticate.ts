import { Request, RequestHandler } from 'express';

import { TokenService } from '../../../application/auth/services/TokenService';
import { UnauthorizedError } from '../../../application/shared';
// Adds req.auth to the Express Request type.
import '../../../types/express';

export interface PublicRoute {
  method: string;
  /** Exact path, or a prefix when it ends with '/*'. Relative to the router where the middleware is mounted. */
  path: string;
}

const matches = (route: PublicRoute, req: Request) => {
  if (route.method !== req.method) return false;
  return route.path.endsWith('/*')
    ? req.path.startsWith(route.path.slice(0, -1))
    : req.path === route.path;
};

const tokenService = new TokenService();

/**
 * Secure by default: every request must carry a valid "Authorization:
 * Bearer <access token>" header unless its route is explicitly listed as
 * public. The authenticated user id is exposed as req.auth.userId.
 */
export const authenticate =
  (publicRoutes: PublicRoute[]): RequestHandler =>
    (req, _res, next) => {
      if (publicRoutes.some((route) => matches(route, req))) return next();

      const [scheme, token] = (req.headers.authorization ?? '').split(' ');
      if (scheme !== 'Bearer' || !token) {
        return next(new UnauthorizedError());
      }

      try {
        req.auth = tokenService.verifyAccessToken(token);
        next();
      } catch (error) {
        next(error);
      }
    };

/** Returns the authenticated user id; only valid behind authenticate(). */
export const getAuthUserId = (req: Request): string => {
  if (!req.auth) throw new UnauthorizedError();
  return req.auth.userId;
};
