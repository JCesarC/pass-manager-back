import express from 'express';

import { VaultHandler } from '../handlers';
import { validateObjectIdParams } from '../../../../middlewares';

const vaultRouter = express.Router();

const vaultHandler = new VaultHandler();

vaultRouter.get('/', vaultHandler.getAllVaults);
vaultRouter.post('/', vaultHandler.createVault);
vaultRouter.get('/:id', validateObjectIdParams('id'), vaultHandler.getVaultById);
vaultRouter.put('/:id', validateObjectIdParams('id'), vaultHandler.updateVault);
vaultRouter.delete('/:id', validateObjectIdParams('id'), vaultHandler.deleteVault);

export default vaultRouter;
