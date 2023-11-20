import { Container } from 'inversify';

import { IVaultRepository } from '../../../../../domain/vaults/repository/IVaultRepository';
import { TYPES } from '../../../../../domain/types';

import { VaultRepository } from '../../../../persistance/mongoose/database/vaults/repository/VaultRepository';
import VaultSchema from '../../../../persistance/mongoose/database/vaults/models/VaultSchema';

const setupVaultRepository = (iocContainer: Container) => {
  iocContainer.bind<IVaultRepository>(TYPES.IVaultRepository).toDynamicValue(() => {
    return new VaultRepository(VaultSchema);
  });
};

export { setupVaultRepository };
