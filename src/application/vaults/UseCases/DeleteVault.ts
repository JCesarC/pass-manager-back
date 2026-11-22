import { IFieldValueRepository } from '../../../domain/fieldValues/repository/IFieldValueRepository';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { NotFoundError } from '../../shared';

export class DeleteVaultUseCase {
  constructor(
    private readonly vaultRepository: IVaultRepository,
    private readonly fieldValueRepository: IFieldValueRepository,
  ) {}

  async exec(ownerId: string, vaultId: string): Promise<void> {
    const deleted = await this.vaultRepository.deleteOwned(vaultId, ownerId);
    if (!deleted) throw new NotFoundError('Vault');
    await this.fieldValueRepository.deleteByVault(vaultId);
  }
}
