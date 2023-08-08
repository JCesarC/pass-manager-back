import express from 'express';
import { VaultHandler } from '../handlers';

const vaultRouter = express.Router();

const vaultHandler = new VaultHandler();

vaultRouter.get('/', vaultHandler.getAllVaults);

export default vaultRouter;
