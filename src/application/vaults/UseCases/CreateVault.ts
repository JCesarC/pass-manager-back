import { IVaultModel } from '../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';

export class CreateVaultUseCase {
  constructor(private readonly vaultRepository: IVaultRepository) {}

  async exec(ownerId: string, vaultData: Partial<IVaultModel>): Promise<IVaultModel> {
    return this.vaultRepository.create({ ...vaultData, user: ownerId } as unknown as IVaultModel);
  }
}
