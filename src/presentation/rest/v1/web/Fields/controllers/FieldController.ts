import { inject, injectable } from 'inversify';
import { Body, Example, Get, OperationId, Post, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';
import { IFieldModel } from '../../../../../../domain/fields/interfaces';

import { CreateFieldUseCase, GetAllFieldsUseCase } from '../../../../../../application/Fields/Usecases';
import { fieldValidator } from '../../../../../../application/Fields/FieldValidator';
import { validate } from '../../../../../../application/shared';

import { ErrorResponseBody, Field, FieldInput, presentField } from '../../../contracts';

@Route('/api/v1/fields')
@Tags('Fields')
@Security('bearer')
@injectable()
@Response<ErrorResponseBody>(401, 'Missing, invalid or expired access token', {
  error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
})
export class FieldController {
  constructor(@inject(TYPES.IFieldRepository) private readonly fieldRepository: IFieldRepository) {}

  /**
   * @summary List the field definitions catalog
   */
  @Get('/')
  @OperationId('listFields')
  @Example<Field[]>([{ _id: '6650f0a1b3c4d5e6f7a8b9a1', name: 'Recovery code', type: '6650f09fb3c4d5e6f7a8b9a0' }])
  async getAllFields(): Promise<Field[]> {
    const fields = await new GetAllFieldsUseCase(this.fieldRepository).exec();
    return (fields ?? []).map(presentField);
  }

  /**
   * @summary Add a field definition to the catalog
   */
  @Post('/')
  @OperationId('createField')
  @SuccessResponse(201, 'Field created')
  @Response<ErrorResponseBody>(400, 'Invalid body', {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'The request is invalid.',
      details: [{ path: 'name', message: '"name" is required' }],
    },
  })
  async createField(@Body() fieldData: FieldInput): Promise<Field> {
    const field = validate(fieldValidator, fieldData) as unknown as IFieldModel;
    return presentField(await new CreateFieldUseCase(this.fieldRepository).exec(field));
  }
}
