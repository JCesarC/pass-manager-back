import { inject, injectable } from 'inversify';
import { Example, Get, OperationId, Response, Route, Security, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';

import { GetAllFieldsUseCase } from '../../../../../../application/Fields/Usecases';

import { ErrorResponseBody, Field, presentField } from '../../../contracts';

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
   * @summary List the field definitions catalog (read-only, defined by the server)
   */
  @Get('/')
  @OperationId('listFields')
  @Example<Field[]>([{ _id: '6650f0a1b3c4d5e6f7a8b9a1', name: 'Recovery code', type: '6650f09fb3c4d5e6f7a8b9a0' }])
  async getAllFields(): Promise<Field[]> {
    const fields = await new GetAllFieldsUseCase(this.fieldRepository).exec();
    return (fields ?? []).map(presentField);
  }
}
