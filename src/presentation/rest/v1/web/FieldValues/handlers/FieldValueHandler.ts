import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import { FieldValueController } from '../controllers/FieldValueController';
import { asyncHandler } from '../../../../shared';

const buildController = () =>
  new FieldValueController(iocContainer.get<IFieldValueRepository>(TYPES.IFieldValueRepository));

export class FieldValueHandler {
  getAllFieldValues = asyncHandler(async (_req, res) => {
    const response = await buildController().getAllFieldValues();
    res.status(200).json(response);
  });

  createFieldValue = asyncHandler(async (req, res) => {
    const response = await buildController().createFieldValue(req.body);
    res.status(201).json(response);
  });
}
