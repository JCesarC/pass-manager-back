import { Request, Response } from 'express';

import { AuthController } from '../../services/AuthController';
import { IUserResponseModel } from '../../../../Collections/users/models';

export const authUserRouterHandler = async (req: Request, res: Response) => {
  try {
    const authController = new AuthController();
    const { _id = '' } = req.user as IUserResponseModel;

    const user = await authController.getAuthenticatedUserData(_id);
    return res.status(200).send({
      error: false,
      user
    });
  } catch (error: any) {
    return res.status(500).send({
      error: true,
      errorMessage: `${error?.message}`
    });
  }
};
