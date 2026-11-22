import { Request, RequestHandler } from 'express';

import { ForbiddenError } from '../../../application/shared';
import { env } from '../../../infrastructure/shared/config';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const originOf = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  try {
    return new URL(url).origin;
  } catch {
    return 'null';
  }
};

const ownOrigin = (req: Request) => `${req.protocol}://${req.get('host')}`;

export const requireTrustedOrigin: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin') ?? originOf(req.get('referer'));
  if (!origin) return next();

  const trusted = origin === ownOrigin(req) || env.CORS_ORIGINS.includes(origin);
  next(trusted ? undefined : new ForbiddenError('Cross-site requests are not allowed.'));
};
