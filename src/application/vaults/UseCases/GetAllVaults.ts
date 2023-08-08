import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { IGetAllVaultsUseCase } from '../../../domain/vaults/UseCases';

import { AllVaultsResponseType } from '../../../domain/vaults/types';

export class GetAllVaultsUseCase implements IGetAllVaultsUseCase{
  private vaultRepository;
  constructor(vaultRepository: IVaultRepository) {
    this.vaultRepository = vaultRepository;
  }

  async exec(page: number, limit: number): Promise<AllVaultsResponseType> {
    const vaults = await this.vaultRepository.getAllVaultsPaginated(page, limit);
    const total = await this.vaultRepository.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const response: AllVaultsResponseType = {
      vaults: vaults || [],
      totalPages,
      currentPage: page
    };

    return response;
  }

}
