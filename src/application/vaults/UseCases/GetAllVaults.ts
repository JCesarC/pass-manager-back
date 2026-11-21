import { IVaultRepository } from '../../../domain/vaults/repository/IVaultRepository';
import { IGetAllVaultsUseCase } from '../../../domain/vaults/UseCases';
import { AllVaultsResponseType } from '../../../domain/vaults/types';

export class GetAllVaultsUseCase implements IGetAllVaultsUseCase {
  constructor(private readonly vaultRepository: IVaultRepository) {}

  async exec(ownerId: string, page: number, limit: number): Promise<AllVaultsResponseType> {
    const [vaults, total] = await Promise.all([
      this.vaultRepository.findOwnedPaginated(ownerId, page, limit),
      this.vaultRepository.countOwned(ownerId),
    ]);

    return {
      vaults,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }
}
