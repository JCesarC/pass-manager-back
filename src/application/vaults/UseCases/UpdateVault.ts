import { IVaultModel } from '../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { NotFoundError } from '../../shared';

export class UpdateVaultUseCase {
  constructor(private readonly vaultRepository: IVaultRepository) {}

  async exec(ownerId: string, vaultId: string, changes: Partial<IVaultModel>): Promise<IVaultModel> {
    const vault = await this.vaultRepository.updateOwned(vaultId, ownerId, changes);
    if (!vault) throw new NotFoundError('Vault');
    return vault;
  }
}
