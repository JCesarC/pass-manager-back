import { Request, Response } from 'express';

import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';

import { IFieldRepository } from '../../../../../../domain/fields/repository';

import { FieldController } from '../controllers/FieldController';

export class FieldHandler {
  async getAllFields(req: Request, res: Response) {
    try {
      const fieldRepository = iocContainer.get<IFieldRepository>(TYPES.IFieldRepository);
      const fieldController = new FieldController(fieldRepository);
      const response = await fieldController.getAllFields();
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`
      });
    }
  }

  async createField(req: Request, res: Response) {
    try {
      const fieldRepository = iocContainer.get<IFieldRepository>(TYPES.IFieldRepository);
      const fieldController = new FieldController(fieldRepository);
      // * TODO: Add field validator like fieldValue validator
      const response = await fieldController.createField(req.body);
      return res.status(201).send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`
      });
    }
  }
}
