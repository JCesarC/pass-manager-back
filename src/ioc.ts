import { Container } from 'inversify';

import {
  setupFieldRepository,
  setupFieldTypeRepository,
  setupFieldValueRepository,
  setupNoteRepository,
  setupRefreshTokenRepository,
  setupVaultRepository,
} from './infrastructure/config/ioc/iocSetups/repositories';

const iocContainer = new Container();

setupFieldValueRepository(iocContainer);
setupFieldTypeRepository(iocContainer);
setupFieldRepository(iocContainer);
setupVaultRepository(iocContainer);
setupNoteRepository(iocContainer);
setupRefreshTokenRepository(iocContainer);

export { iocContainer };
