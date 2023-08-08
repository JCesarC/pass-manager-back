import { IVaultModel } from '../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';

export class CreateVaultUseCase {
  private vaultRepository;

  constructor(vaultRepository: IVaultRepository){
    this.vaultRepository = vaultRepository;
  }

  async exec(vaultData: IVaultModel){
    const createdVault = await this.vaultRepository.create(vaultData);
    return createdVault;
  }
}
