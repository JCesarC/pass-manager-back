import { inject, injectable } from 'inversify';
import { Body, Delete, Get, Inject, Path, Post, Put, Query, Route, Security, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';

import { AllVaultsResponseType } from '../../../../../../domain/vaults/types';
import { IVaultModel } from '../../../../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import {
  CreateVaultUseCase,
  DeleteVaultUseCase,
  GetAllVaultsUseCase,
  GetVaultByIdUseCase,
  UpdateVaultUseCase,
} from '../../../../../../application/vaults/UseCases';
import { VaultInput, VaultUpdateInput, vaultUpdateValidator, vaultValidator } from '../../../../../../application/vaults/VaultValidator';
import { validate } from '../../../../../../application/shared';

/** Every operation is scoped to the authenticated user (ownerId comes from the access token). */
@Route('/api/v1/vaults')
@Tags('VaultController')
@Security('bearer')
@injectable()
export class VaultController {
  constructor(
    @inject(TYPES.IVaultRepository) private readonly vaultRepository: IVaultRepository,
    @inject(TYPES.IFieldValueRepository) private readonly fieldValueRepository: IFieldValueRepository,
  ) {}

  /**
   * Vaults of the authenticated user, newest first.
   * @param page Page number, starting at 1
   * @param limit Vaults per page (max 50)
   */
  @Get('/')
  async getAllVaults(
    @Query() page: number,
    @Query() limit: number,
    @Inject() ownerId: string,
  ): Promise<AllVaultsResponseType> {
    return new GetAllVaultsUseCase(this.vaultRepository).exec(ownerId, page, limit);
  }

  @Get('/{id}')
  async getVaultById(@Path() id: string, @Inject() ownerId: string): Promise<IVaultModel> {
    return new GetVaultByIdUseCase(this.vaultRepository).exec(ownerId, id);
  }

  @Post('/')
  async createVault(@Body() vaultData: VaultInput, @Inject() ownerId: string): Promise<IVaultModel> {
    const vault = validate(vaultValidator, vaultData);
    return new CreateVaultUseCase(this.vaultRepository).exec(ownerId, vault);
  }

  @Put('/{id}')
  async updateVault(
    @Path() id: string,
    @Body() vaultData: VaultUpdateInput,
    @Inject() ownerId: string,
  ): Promise<IVaultModel> {
    const changes = validate(vaultUpdateValidator, vaultData);
    return new UpdateVaultUseCase(this.vaultRepository).exec(ownerId, id, changes);
  }

  /** Deletes the vault and all its field values. */
  @Delete('/{id}')
  async deleteVault(@Path() id: string, @Inject() ownerId: string): Promise<void> {
    return new DeleteVaultUseCase(this.vaultRepository, this.fieldValueRepository).exec(ownerId, id);
  }
}
