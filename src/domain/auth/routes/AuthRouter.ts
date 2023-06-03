import express, { Request, Response } from 'express';
import { AuthController } from '../services/AuthController';

const authRouter = express.Router();

authRouter.route('/register').post(async (req: Request, res: Response) => {
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

export default authRouter;
