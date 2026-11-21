import { Container } from 'inversify';

import { TYPES } from '../../../../../domain/types';
import { IRefreshTokenRepository } from '../../../../../domain/auth/repository/IRefreshTokenRepository';
import { RefreshTokenRepository } from '../../../../persistance/mongoose/database/refreshTokens/repository/RefreshTokenRepository';

const setupRefreshTokenRepository = (iocContainer: Container) => {
  iocContainer.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).to(RefreshTokenRepository);
};

export { setupRefreshTokenRepository };
