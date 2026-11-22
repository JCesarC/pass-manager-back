import { inject, injectable } from 'inversify';
import {
  Body,
  Delete,
  Example,
  Get,
  Inject,
  OperationId,
  Path,
  Post,
  Put,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import {
  CreateVaultUseCase,
  DeleteVaultUseCase,
  GetAllVaultsUseCase,
  GetVaultByIdUseCase,
  UpdateVaultUseCase,
} from '../../../../../../application/vaults/UseCases';
import {
  VaultInput,
  VaultUpdateInput,
  vaultUpdateValidator,
  vaultValidator,
} from '../../../../../../application/vaults/VaultValidator';
import { validate } from '../../../../../../application/shared';

import { ErrorResponseBody, presentVault, Vault, VaultPage } from '../../../contracts';

@Route('/api/v1/vaults')
@Tags('Vaults')
@Security('bearer')
@injectable()
@Response<ErrorResponseBody>(400, 'Invalid id, query or body', {
  error: {
    code: 'VALIDATION_ERROR',
    message: 'The request is invalid.',
    details: [{ path: 'user', message: '"user" is not allowed' }],
  },
})
@Response<ErrorResponseBody>(401, 'Missing, invalid or expired access token', {
  error: { code: 'UNAUTHORIZED', message: 'Authentication is required.' },
})
export class VaultController {
  constructor(
    @inject(TYPES.IVaultRepository) private readonly vaultRepository: IVaultRepository,
    @inject(TYPES.IFieldValueRepository) private readonly fieldValueRepository: IFieldValueRepository,
  ) {}

  /**
   * @summary List the authenticated user's vaults, newest first
   * @param page Page number, starting at 1
   * @param limit Vaults per page, up to 50
   * @isInt page
   * @minimum page 1
   * @isInt limit
   * @minimum limit 1
   * @maximum limit 50
   */
  @Get('/')
  @OperationId('listVaults')
  @Example<VaultPage>({
    vaults: [
      {
        _id: '6650f3d5b3c4d5e6f7a8b9e2',
        user: '6650f1a2b3c4d5e6f7a8b9c0',
        name: 'Personal email',
        data: 'not-encrypted-yet',
        dataFieldType: 'password',
        isFavorite: true,
        tags: ['email'],
        isArchived: false,
        expirationDate: null,
        extraFields: [],
      },
    ],
    totalPages: 1,
    currentPage: 1,
  })
  async getAllVaults(
    @Query() page = 1,
    @Query() limit = 10,
    @Inject() ownerId: string,
  ): Promise<VaultPage> {
    const result = await new GetAllVaultsUseCase(this.vaultRepository).exec(ownerId, page, limit);
    return { ...result, vaults: result.vaults.map(presentVault) };
  }

  /**
   * @summary Get one of the authenticated user's vaults with its field values
   */
  @Get('/{id}')
  @OperationId('getVault')
  @Response<ErrorResponseBody>(404, 'The vault does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Vault not found.' },
  })
  async getVaultById(@Path() id: string, @Inject() ownerId: string): Promise<Vault> {
    return presentVault(await new GetVaultByIdUseCase(this.vaultRepository).exec(ownerId, id));
  }

  /**
   * @summary Create a vault owned by the authenticated user
   */
  @Post('/')
  @OperationId('createVault')
  @SuccessResponse(201, 'Vault created')
  async createVault(@Body() vaultData: VaultInput, @Inject() ownerId: string): Promise<Vault> {
    const vault = validate(vaultValidator, vaultData);
    return presentVault(await new CreateVaultUseCase(this.vaultRepository).exec(ownerId, vault));
  }

  /**
   * @summary Update one of the authenticated user's vaults
   */
  @Put('/{id}')
  @OperationId('updateVault')
  @Response<ErrorResponseBody>(404, 'The vault does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Vault not found.' },
  })
  async updateVault(
    @Path() id: string,
    @Body() vaultData: VaultUpdateInput,
    @Inject() ownerId: string,
  ): Promise<Vault> {
    const changes = validate(vaultUpdateValidator, vaultData);
    return presentVault(await new UpdateVaultUseCase(this.vaultRepository).exec(ownerId, id, changes));
  }

  /**
   * @summary Delete one of the authenticated user's vaults and its field values
   */
  @Delete('/{id}')
  @OperationId('deleteVault')
  @SuccessResponse(204, 'Vault and field values deleted')
  @Response<ErrorResponseBody>(404, 'The vault does not exist or belongs to another user', {
    error: { code: 'NOT_FOUND', message: 'Vault not found.' },
  })
  async deleteVault(@Path() id: string, @Inject() ownerId: string): Promise<void> {
    return new DeleteVaultUseCase(this.vaultRepository, this.fieldValueRepository).exec(ownerId, id);
  }
}
