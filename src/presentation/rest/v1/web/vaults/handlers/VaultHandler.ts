import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { VaultController } from '../controllers/VaultController';
import { asyncHandler, getPaginationQueries } from '../../../../shared';

const buildController = () =>
  new VaultController(iocContainer.get<IVaultRepository>(TYPES.IVaultRepository));

export class VaultHandler {
  getAllVaults = asyncHandler(async (req, res) => {
    const { page, limit } = getPaginationQueries(req);
    const response = await buildController().getAllVaults(page, limit);
    res.status(200).json(response);
  });

  createVault = asyncHandler(async (req, res) => {
    const response = await buildController().createVault(req.body);
    res.status(201).json(response);
  });
}
