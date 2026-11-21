import { inject, injectable } from 'inversify';
import { Body, Inject, Post, Route, Security, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';
import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { CreateFieldValueUseCase } from '../../../../../../application/FieldValues/UseCases';
import { FieldValueInput, fieldValueValidator } from '../../../../../../application/FieldValues/FieldValueValidator';
import { validate } from '../../../../../../application/shared';

@Route('/api/v1/fieldValues')
@Tags('FieldValueController')
@Security('bearer')
@injectable()
export class FieldValueController {
  constructor(
    @inject(TYPES.IFieldValueRepository) private readonly fieldValueRepository: IFieldValueRepository,
    @inject(TYPES.IVaultRepository) private readonly vaultRepository: IVaultRepository,
    @inject(TYPES.IFieldRepository) private readonly fieldRepository: IFieldRepository,
  ) {}

  /**
   * Adds a field value to one of the caller's vaults. Field values are read
   * through their vault (GET /vaults/{id}).
   */
  @Post('/')
  async createFieldValue(
    @Body() fieldValueData: FieldValueInput,
    @Inject() ownerId: string,
  ): Promise<IFieldValueModel> {
    const fieldValue = validate(fieldValueValidator, fieldValueData);
    return new CreateFieldValueUseCase(
      this.fieldValueRepository,
      this.vaultRepository,
      this.fieldRepository,
    ).exec(ownerId, fieldValue);
  }
}
