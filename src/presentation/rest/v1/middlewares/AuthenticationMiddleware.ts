import { NextFunction, Request, Response } from 'express';

import { AuthService } from '../../../../application/auth/services/AuthService';
import { UnauthorizedError } from '../../../../application/shared';

export const checkLoggedIn = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    const authService = new AuthService();
    const decodedToken = authService.validateToken(token);
    req.user = { _id: decodedToken._id };
    next();
  } catch {
    next(new UnauthorizedError('The session is invalid or has expired.'));
  }
};
