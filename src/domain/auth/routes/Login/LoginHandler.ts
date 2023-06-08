import { Request, Response } from 'express';

import { AuthController } from '../../services/AuthController';

export const loginHandler = async(req: Request, res: Response) => {
  try {
    const authController = new AuthController();
    const response = await authController.loginUser(req.body);
    return res.status(201).send(response);
  } catch (error) {
    return res.status(400).send({
      error: true,
      errorMessage: `${error}`
    });
  }
};
