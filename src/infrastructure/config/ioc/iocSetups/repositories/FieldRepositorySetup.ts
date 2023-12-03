import { Container } from 'inversify';

import { TYPES } from '../../../../../domain/types';
import { IFieldRepository } from '../../../../../domain/fields/repository';

import FieldSchema from '../../../../persistance/mongoose/database/Fields/models/FieldSchema';
import { FieldRepository } from '../../../../persistance/mongoose/database/Fields/repository/FieldRepository';

const setupFieldRepository = (iocContainer: Container) => {
  iocContainer.bind<IFieldRepository>(TYPES.IFieldRepository).toDynamicValue(() => {
    return new FieldRepository(FieldSchema);
  });
};

export { setupFieldRepository };
