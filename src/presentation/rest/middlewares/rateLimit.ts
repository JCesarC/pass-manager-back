import { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';

import { AppError } from '../../../application/shared';

export interface RateLimitOptions {
  windowMinutes: number;
  max: number;
}

export const createRateLimiter = ({ windowMinutes, max }: RateLimitOptions): RequestHandler =>
  rateLimit({
    windowMs: windowMinutes * 60_000,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (_req, _res, next) =>
      next(new AppError('RATE_LIMITED', 'Too many requests. Please try again later.')),
  });
