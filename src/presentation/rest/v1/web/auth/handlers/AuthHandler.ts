import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';
import { IRefreshTokenRepository } from '../../../../../../domain/auth/repository/IRefreshTokenRepository';
import { IOAuthCodeRepository } from '../../../../../../domain/auth/repository/IOAuthCodeRepository';
import { UserRepository } from '../../../../../../infrastructure/persistance/mongoose/database/users/repository/UserRepository';

import { AuthController } from '../controller/AuthController';
import { asyncHandler } from '../../../../shared';
import { clearRefreshTokenCookie, readRefreshTokenCookie, setRefreshTokenCookie } from '../refreshTokenCookie';

const buildController = () =>
  new AuthController(
    new UserRepository(),
    iocContainer.get<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository),
    iocContainer.get<IOAuthCodeRepository>(TYPES.IOAuthCodeRepository),
  );

export class AuthHandler {

  public registerHandler = asyncHandler(async (req, res) => {
    const response = await buildController().registerUser(req.body);
    res.status(201).json(response);
  });

  public loginHandler = asyncHandler(async (req, res) => {
    const { refreshToken, ...session } = await buildController().loginUser(req.body);
    setRefreshTokenCookie(res, refreshToken.token, refreshToken.expiresAt);
    res.status(200).json(session);
  });

  public refreshHandler = asyncHandler(async (req, res) => {
    try {
      const { refreshToken, ...session } = await buildController().refreshSession(readRefreshTokenCookie(req));
      setRefreshTokenCookie(res, refreshToken.token, refreshToken.expiresAt);
      res.status(200).json(session);
    } catch (error) {
      // A rejected refresh token is useless to the client; remove it.
      clearRefreshTokenCookie(res);
      throw error;
    }
  });

  public oauthExchangeHandler = asyncHandler(async (req, res) => {
    const { refreshToken, ...session } = await buildController().exchangeOAuthCode(req.body);
    setRefreshTokenCookie(res, refreshToken.token, refreshToken.expiresAt);
    res.status(200).json(session);
  });

  public logoutHandler = asyncHandler(async (req, res) => {
    await buildController().logoutUser(readRefreshTokenCookie(req));
    clearRefreshTokenCookie(res);
    res.status(204).end();
  });

}
