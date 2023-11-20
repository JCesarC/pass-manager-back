import { Container } from 'inversify';

import { TYPES } from '../../../../../domain/types';
import { IFieldValueRepository } from '../../../../../domain/fieldValues/repository/IFieldValueRepository';

import FieldValueSchema from '../../../../persistance/mongoose/database/FieldValues/models/FieldValueSchema';
import { FieldValueRepository } from '../../../../persistance/mongoose/database/FieldValues/repository/FieldValueRepository';

const setupFieldValueRepository = (iocContainer: Container) => {
  iocContainer.bind<IFieldValueRepository>(TYPES.IFieldValueRepository).toDynamicValue(() => {
    return new FieldValueRepository(FieldValueSchema);
  });
};

export { setupFieldValueRepository };
