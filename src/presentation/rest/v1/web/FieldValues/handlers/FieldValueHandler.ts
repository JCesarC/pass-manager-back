import { Request, Response } from 'express';

import { iocContainer } from '../../../../../../ioc';
import { TYPES } from '../../../../../../domain/types';

import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';
import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';

import { fieldValueValidator } from '../../../../../../application/FieldValues/FieldValueValidator';
import { ThrowValidatorError } from '../../../../../../application/shared';

import { FieldValueController } from '../controllers/FieldValueController';

export class FieldValueHandler{
  async getAllFieldValues(req: Request, res: Response){
    try {
      const fieldValueRepository = iocContainer.get<IFieldValueRepository>(TYPES.IFieldValueRepository);
      const fieldValueController = new FieldValueController(fieldValueRepository);
      const response = await fieldValueController.getAllFieldValues();
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`
      });
    }
  }

  async createFieldValue(req: Request, res: Response){
    try {
      const fieldValueRepository = iocContainer.get<IFieldValueRepository>(TYPES.IFieldValueRepository);

      const fieldValueController = new FieldValueController(fieldValueRepository);
      const { error, value } = fieldValueValidator.validate(req.body);

      if (error) return ThrowValidatorError(error);
      // * TODO: Move validator logic to controller
      const fieldValueData = value as IFieldValueModel;
      const response = await fieldValueController.createFieldValue(fieldValueData);
      return res.status(201).send(response);
    } catch (error) {
      return res.status(400).send({
        error: true,
        errorMessage: `${error}`
      });
    }
  }
}
