import { Container } from 'inversify';

import { TYPES } from '../../../../../domain/types';
import { IOAuthCodeRepository } from '../../../../../domain/auth/repository/IOAuthCodeRepository';
import { OAuthCodeRepository } from '../../../../persistance/mongoose/database/oauthCodes/repository/OAuthCodeRepository';

const setupOAuthCodeRepository = (iocContainer: Container) => {
  iocContainer.bind<IOAuthCodeRepository>(TYPES.IOAuthCodeRepository).to(OAuthCodeRepository);
};

export { setupOAuthCodeRepository };
