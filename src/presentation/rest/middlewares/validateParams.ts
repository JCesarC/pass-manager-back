import { RequestHandler } from 'express';

import { ValidationError } from '../../../application/shared';

const OBJECT_ID = /^[a-f\d]{24}$/i;

export const validateObjectIdParams =
  (...names: string[]): RequestHandler =>
    (req, _res, next) => {
      const details = names
        .filter((name) => !OBJECT_ID.test(req.params[name] ?? ''))
        .map((name) => ({ path: name, message: `"${name}" must be a valid id` }));

      next(details.length > 0 ? new ValidationError('The request is invalid.', details) : undefined);
    };
