import { AuthController } from '../controller/AuthController';
import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';
import { asyncHandler } from '../../../../shared';
import { getAuthUserId } from '../../../../middlewares';

const buildController = () => new AuthController(new UserRepository());

export class AuthHandler {

  public registerHandler = asyncHandler(async (req, res) => {
    const response = await buildController().registerUser(req.body);
    res.status(201).json(response);
  });

  public loginHandler = asyncHandler(async (req, res) => {
    const response = await buildController().loginUser(req.body);
    res.status(200).json(response);
  });

  public getauthUserDataHandler = asyncHandler(async (req, res) => {
    const user = await buildController().getAuthenticatedUserData(getAuthUserId(req));
    res.status(200).json({ user });
  });

}
