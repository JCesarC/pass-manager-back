import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';

import { AppError, ErrorCode, ErrorDetail } from '../../../application/shared';

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  INVALID_CREDENTIALS: 401,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  ACCOUNT_LOCKED: 429,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
};

export interface ErrorResponseBody {
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetail[];
  };
}

/** Translates known infrastructure errors into application errors. */
const toAppError = (err: unknown): AppError | null => {
  if (err instanceof AppError) return err;

  const bodyParserType = (err as { type?: string })?.type;
  if (bodyParserType === 'entity.parse.failed') {
    return new AppError('VALIDATION_ERROR', 'The request body is not valid JSON.');
  }
  if (bodyParserType === 'entity.too.large') {
    return new AppError('PAYLOAD_TOO_LARGE', 'The request body is too large.');
  }

  if (err instanceof mongoose.Error.CastError) {
    return new AppError('VALIDATION_ERROR', `Invalid value for "${err.path}".`);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
    return new AppError('VALIDATION_ERROR', 'The request is invalid.', details);
  }
  if ((err as { code?: number })?.code === 11000) {
    return new AppError('CONFLICT', 'The resource already exists.');
  }

  return null;
};

/** Single place where errors become HTTP responses. Internal details never leave the server. */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const appError = toAppError(err);

  if (!appError) {
    req.log.error({ err }, 'Unhandled error');
    const body: ErrorResponseBody = {
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
    };
    res.status(500).json(body);
    return;
  }

  const body: ErrorResponseBody = {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details && { details: appError.details }),
    },
  };
  res.status(STATUS_BY_CODE[appError.code]).json(body);
};

export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ErrorResponseBody = {
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found.` },
  };
  res.status(404).json(body);
};
