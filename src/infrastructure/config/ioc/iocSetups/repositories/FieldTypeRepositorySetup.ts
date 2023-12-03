import { Container } from 'inversify';

import { TYPES } from '../../../../../domain/types';
import { IFieldTypeRepository } from '../../../../../domain/fields/repository';

import FieldTypeSchema from '../../../../persistance/mongoose/database/FieldsTypes/models/FieldTypeSchema';
import { FieldTypeRepository } from '../../../../persistance/mongoose/database/FieldsTypes/repository/FieldTypeRepository';

const setupFieldTypeRepository = (iocContainer: Container) => {
  iocContainer.bind<IFieldTypeRepository>(TYPES.IFieldTypeRepository).toDynamicValue(() => {
    return new FieldTypeRepository(FieldTypeSchema);
  });
};

export { setupFieldTypeRepository };
