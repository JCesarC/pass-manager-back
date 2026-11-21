import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import { VaultController } from '../controllers/VaultController';
import { asyncHandler, getPaginationQueries } from '../../../../shared';
import { getAuthUserId } from '../../../../middlewares';

const buildController = () =>
  new VaultController(
    iocContainer.get<IVaultRepository>(TYPES.IVaultRepository),
    iocContainer.get<IFieldValueRepository>(TYPES.IFieldValueRepository),
  );

export class VaultHandler {
  getAllVaults = asyncHandler(async (req, res) => {
    const { page, limit } = getPaginationQueries(req);
    const response = await buildController().getAllVaults(page, limit, getAuthUserId(req));
    res.status(200).json(response);
  });

  getVaultById = asyncHandler(async (req, res) => {
    const vault = await buildController().getVaultById(req.params.id, getAuthUserId(req));
    res.status(200).json(vault);
  });

  createVault = asyncHandler(async (req, res) => {
    const response = await buildController().createVault(req.body, getAuthUserId(req));
    res.status(201).json(response);
  });

  updateVault = asyncHandler(async (req, res) => {
    const response = await buildController().updateVault(req.params.id, req.body, getAuthUserId(req));
    res.status(200).json(response);
  });

  deleteVault = asyncHandler(async (req, res) => {
    await buildController().deleteVault(req.params.id, getAuthUserId(req));
    res.status(204).end();
  });
}
