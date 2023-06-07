import { NextFunction, Request, Response } from 'express';
import { validateToken } from '../utils/AuthUtils';

export const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: 'You must log in!',
    });
  }

  try {
    const decodedToken = validateToken(token);

    console.log('decodedToken.id: ', decodedToken._id);
    req.user = { _id: decodedToken._id };

    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token!',
    });
  }
};
