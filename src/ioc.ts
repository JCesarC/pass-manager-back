import { Container } from 'inversify';

import { IVaultRepository } from './domain/vaults/repository/IVaultRepository';
import { IFieldRepository, IFieldTypeRepository } from './domain/fields/repository';
import { IFieldValueRepository } from './domain/fieldValues/repository/IFieldValueRepository';

import { TYPES } from './domain/types';

import { VaultRepository } from './infrastructure/persistance/mongoose/database/vaults/repository/VaultRepository';
import { FieldRepository } from './infrastructure/persistance/mongoose/database/Fields/repository/FieldRepository';
import { FieldValueRepository } from './infrastructure/persistance/mongoose/database/FieldValues/repository/FieldValueRepository';
import { FieldTypeRepository } from './infrastructure/persistance/mongoose/database/FieldsTypes/repository/FieldTypeRepository';

// Create a new container tsoa can use
const iocContainer = new Container();

iocContainer.bind<IVaultRepository>(TYPES.IVaultRepository).to(VaultRepository);
iocContainer.bind<IFieldRepository>(TYPES.IFieldRepository).to(FieldRepository);
iocContainer.bind<IFieldValueRepository>(TYPES.IFieldValueRepository).to(FieldValueRepository);
iocContainer.bind<IFieldTypeRepository>(TYPES.IFieldTypeRepository).to(FieldTypeRepository);

export { iocContainer };
