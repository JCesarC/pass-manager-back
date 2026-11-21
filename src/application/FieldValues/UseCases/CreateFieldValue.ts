import { IFieldRepository } from '../../../domain/fields/repository';
import { IFieldValueModel } from '../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../domain/fieldValues/repository/IFieldValueRepository';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { NotFoundError } from '../../shared';
import { FieldValueInput } from '../FieldValueValidator';

export class CreateFieldValueUseCase {
  constructor(
    private readonly fieldValueRepository: IFieldValueRepository,
    private readonly vaultRepository: IVaultRepository,
    private readonly fieldRepository: IFieldRepository,
  ) {}

  /** Adds a field value to one of the caller's vaults. */
  async exec(ownerId: string, fieldValueData: FieldValueInput): Promise<IFieldValueModel> {
    const vaultId = fieldValueData.vault;

    const vault = await this.vaultRepository.findOwnedById(vaultId, ownerId);
    if (!vault) throw new NotFoundError('Vault');

    const field = await this.fieldRepository.getById(fieldValueData.field);
    if (!field) throw new NotFoundError('Field');

    const created = await this.fieldValueRepository.create(fieldValueData as unknown as IFieldValueModel);
    await this.vaultRepository.addExtraField(vaultId, String(created._id));
    return created;
  }
}
