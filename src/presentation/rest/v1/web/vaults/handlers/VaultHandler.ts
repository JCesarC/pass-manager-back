import { Request, Response } from 'express';

import { iocContainer } from '../../../../../../ioc';

import { TYPES } from '../../../../../../domain/types';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { VaultController } from '../controllers/VaultController';
import { IVaultModel } from '../../../../../../domain/vaults/interfaces';

export class VaultHandler {
  async getAllVaults(req: Request, res: Response){
    try {
      const vaultRepository = iocContainer.get<IVaultRepository>(TYPES.IVaultRepository);
      const vaultController = new VaultController(vaultRepository);

      const page = req?.query?.page as string || '1';
      const limit = req?.query?.limit as string || '5';

      const intPage = parseInt(page);
      const intLimit = parseInt(limit);

      const response = await vaultController.getAllVaults(intPage, intLimit);
      console.log('response: ', response);
      return res.send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }

  async createVault(req: Request, res: Response){
    try{
      const vaultRepository = iocContainer.get<IVaultRepository>(TYPES.IVaultRepository);
      const vaultController = new VaultController(vaultRepository);

      const vaultData = req.body as IVaultModel;

      const response = await vaultController.createVault(vaultData);
      console.log('response: ', response);
      return res.status(201).send(response);
    } catch (error) {
      return res.status(500).send({
        error: true,
        errorMessage: `${error}`,
      });
    }
  }
}
