import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';

import { FieldController } from '../controllers/FieldController';
import { asyncHandler } from '../../../../shared';

const buildController = () =>
  new FieldController(iocContainer.get<IFieldRepository>(TYPES.IFieldRepository));

export class FieldHandler {
  getAllFields = asyncHandler(async (_req, res) => {
    const response = await buildController().getAllFields();
    res.status(200).json(response);
  });

  createField = asyncHandler(async (req, res) => {
    const response = await buildController().createField(req.body);
    res.status(201).json(response);
  });
}
