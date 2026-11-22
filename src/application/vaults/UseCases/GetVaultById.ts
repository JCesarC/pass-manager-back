import { IVaultModel } from '../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { NotFoundError } from '../../shared';

export class GetVaultByIdUseCase {
  constructor(private readonly vaultRepository: IVaultRepository) {}

  async exec(ownerId: string, vaultId: string): Promise<IVaultModel> {
    const vault = await this.vaultRepository.findOwnedById(vaultId, ownerId);
    if (!vault) throw new NotFoundError('Vault');
    return vault;
  }
}
