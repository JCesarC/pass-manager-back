// src/ioc.ts
import { Container } from 'inversify';
import { IVaultRepository } from './domain/vaults/repository/IVaultRepository';
import { VaultRepository } from './infrastructure/persistance/mongoose/database/vaults/repository/VaultRepository';
import { TYPES } from './domain/types';

// Create a new container tsoa can use
const iocContainer = new Container();

iocContainer.bind<IVaultRepository>(TYPES.IVaultRepository).to(VaultRepository);

export { iocContainer };
