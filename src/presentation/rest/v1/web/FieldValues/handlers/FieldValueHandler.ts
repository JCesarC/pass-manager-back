import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { FieldValueController } from '../controllers/FieldValueController';
import { asyncHandler } from '../../../../shared';
import { getAuthUserId } from '../../../../middlewares';

const buildController = () =>
  new FieldValueController(
    iocContainer.get<IFieldValueRepository>(TYPES.IFieldValueRepository),
    iocContainer.get<IVaultRepository>(TYPES.IVaultRepository),
    iocContainer.get<IFieldRepository>(TYPES.IFieldRepository),
  );

export class FieldValueHandler {
  createFieldValue = asyncHandler(async (req, res) => {
    const response = await buildController().createFieldValue(req.body, getAuthUserId(req));
    res.status(201).json(response);
  });
}
