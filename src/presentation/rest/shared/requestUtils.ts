import { Request } from 'express';
import Joi from 'joi';

import { validate } from '../../../application/shared';

export const PAGINATION = Object.freeze({ DEFAULT_LIMIT: 10, MAX_LIMIT: 50 });

const paginationSchema = Joi.object<{ page: number; limit: number }>({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
}).unknown(true);

export const getPaginationQueries = (req: Request) => {
  const { page, limit } = validate(paginationSchema, req.query);
  return { page, limit };
};
