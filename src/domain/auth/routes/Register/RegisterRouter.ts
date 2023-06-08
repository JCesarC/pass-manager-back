import express, { NextFunction, Request, Response, Router } from 'express';
import { registerHandler } from './RegisterHandler';

const firstMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Realizar alguna lógica antes de pasar al siguiente middleware o controlador
  console.log('Middleware 1');
  next();
};

const registerRoute: Router = express.Router();

registerRoute.post('/', firstMiddleware, registerHandler);

export default registerRoute;
