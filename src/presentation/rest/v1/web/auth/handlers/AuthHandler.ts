import { Request, Response } from 'express';
import { userModelValidator } from '../../../../../../application/users/UserValidator';
import { AuthController } from '../controller/AuthController';
import { IUserModel, IUserResponseModel } from '../../../../../../domain/users/interfaces';

export class AuthHandler {

  public async registerHandler(req: Request, res: Response) {
    try {
      const authController = new AuthController();

      const { error, value } = userModelValidator.validate(req.body);
      if (error) {
        // Si hay errores de validación, devolver una respuesta de error
        return res.status(400).send({
          error: true,
          errorMessage: error.details[0].message,
        });
      }

      // Los datos son válidos, crear un objeto con las propiedades validadas
      const user: IUserModel = value as IUserModel;
      const response = await authController.registerUser(user);
      return res.status(201).send(response);
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`
      });
    }
  };

  public async loginHandler(req: Request, res: Response) {
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

  public async getauthUserDataHandler(req: Request, res: Response){
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
        errorMessage: `${error}`
      });
    }
  };

}
