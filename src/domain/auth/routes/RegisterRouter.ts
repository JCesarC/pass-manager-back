import express, { NextFunction, Request, Response, Router } from 'express';
import { AuthController } from '../services/AuthController';

const firstMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Realizar alguna lógica antes de pasar al siguiente middleware o controlador
  console.log('Middleware 1');
  next();
};

const registerRoute: Router = express.Router();

registerRoute.post('/', firstMiddleware, async (req: Request, res: Response) => {
  try {
    const authController = new AuthController();
    const response = await authController.registerUser(req.body);
    return res.status(201).send(response);
  } catch (error) {
    return res.status(400).send({
      error: true,
      errorMessage: `${error}`
    });
  }
});

export default registerRoute;
