import { inject, injectable } from 'inversify';
import { Body, Example, Inject, OperationId, Post, Response, Route, Security, SuccessResponse, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { CreateFieldValueUseCase } from '../../../../../../application/FieldValues/UseCases';
import { FieldValueInput, fieldValueValidator } from '../../../../../../application/FieldValues/FieldValueValidator';
import { validate } from '../../../../../../application/shared';

import { ErrorResponseBody, FieldValue, presentFieldValue } from '../../../contracts';

@Route('/api/v1/fieldValues')
@Tags('Field values')
@Security('bearer')
@injectable()
export class FieldValueController {
  constructor(
    @inject(TYPES.IFieldValueRepository) private readonly fieldValueRepository: IFieldValueRepository,
    @inject(TYPES.IVaultRepository) private readonly vaultRepository: IVaultRepository,
    @inject(TYPES.IFieldRepository) private readonly fieldRepository: IFieldRepository,
  ) {}

  /**
   * @summary Add a field value to one of the authenticated user's vaults
   */
  @Post('/')
  @OperationId('createFieldValue')
  @SuccessResponse(201, 'Field value created and linked to the vault')
  @Example<FieldValue>({
    _id: '6650f4e6b3c4d5e6f7a8b9f3',
    field: '6650f0a1b3c4d5e6f7a8b9a1',
    value: '1234-5678',
    vault: '6650f3d5b3c4d5e6f7a8b9e2',
  })
  @Response<ErrorResponseBody>(400, 'Invalid body', {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'The request is invalid.',
      details: [{ path: 'vault', message: '"vault" length must be 24 characters long' }],
    },
  })
  @Response<ErrorResponseBody>(401, 'Missing, invalid or expired access token', {
    error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
  })
  @Response<ErrorResponseBody>(404, 'The vault belongs to another user or the field does not exist', {
    error: { code: 'NOT_FOUND', message: 'Vault not found.' },
  })
  async createFieldValue(
    @Body() fieldValueData: FieldValueInput,
    @Inject() ownerId: string,
  ): Promise<FieldValue> {
    const fieldValue = validate(fieldValueValidator, fieldValueData);
    const created = await new CreateFieldValueUseCase(
      this.fieldValueRepository,
      this.vaultRepository,
      this.fieldRepository,
    ).exec(ownerId, fieldValue);
    return presentFieldValue(created);
  }
}
