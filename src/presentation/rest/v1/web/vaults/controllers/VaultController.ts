import { Body, Get, Post, Query, Route, Tags } from 'tsoa';

import { AllVaultsResponseType } from '../../../../../../domain/vaults/types';
import { IVaultModel } from '../../../../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { CreateVaultUseCase, GetAllVaultsUseCase } from '../../../../../../application/vaults/UseCases';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../../../domain/types';

@Route('/api/v1/vaults')
@Tags('VaultController')
@injectable()
export class VaultController {
  private vaultRepository;
  constructor(@inject(TYPES.IVaultRepository) vaultRepository: IVaultRepository){
    this.vaultRepository = vaultRepository;
  }
  /**
   * Endpoint to retrieve all vaults paginated
   * @param especific number of page to show
   * @param limit per page to show vaults
   * @returns A group of vaults
   */
  @Get('/')
  async getAllVaults(@Query()page: number, @Query()limit: number): Promise<AllVaultsResponseType>{
    const getAllVaultsUseCase = new GetAllVaultsUseCase(this.vaultRepository);
    const vaults = await getAllVaultsUseCase.exec(page, limit);
    return vaults;
  }
  @Post('/')
  async createVault(@Body()vaultData: IVaultModel){
    const createVaultUseCase = new CreateVaultUseCase(this.vaultRepository);
    const response = createVaultUseCase.exec(vaultData);
    return response;
  }
}
