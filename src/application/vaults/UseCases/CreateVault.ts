import { IVaultModel } from '../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';

export class CreateVaultUseCase {
  constructor(private readonly vaultRepository: IVaultRepository) {}

  async exec(ownerId: string, vaultData: Partial<IVaultModel>): Promise<IVaultModel> {
    // The owner always comes from the authenticated user, never from the payload.
    return this.vaultRepository.create({ ...vaultData, user: ownerId } as unknown as IVaultModel);
  }
}
