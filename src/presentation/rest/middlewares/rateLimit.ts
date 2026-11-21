import { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

import { AppError } from '../../../application/shared';

export interface RateLimitOptions {
  windowMinutes: number;
  max: number;
}

/**
 * Per-IP limit using the standard RateLimit/Retry-After headers. Behind a
 * reverse proxy, USE_PROXY must be enabled so the client IP is correct.
 */
export const createRateLimiter = ({ windowMinutes, max }: RateLimitOptions): RequestHandler =>
  rateLimit({
    windowMs: windowMinutes * 60_000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(new AppError('RATE_LIMITED', 'Too many requests. Please try again later.')),
  });
