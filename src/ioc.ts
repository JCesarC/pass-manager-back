import { Container } from 'inversify';

import {
  setupFieldRepository,
  setupFieldTypeRepository,
  setupFieldValueRepository,
  setupNoteRepository,
  setupVaultRepository,
} from './infrastructure/config/ioc/iocSetups/repositories';

const iocContainer = new Container();

setupFieldValueRepository(iocContainer);
setupFieldTypeRepository(iocContainer);
setupFieldRepository(iocContainer);
setupVaultRepository(iocContainer);
setupNoteRepository(iocContainer);

export { iocContainer };
