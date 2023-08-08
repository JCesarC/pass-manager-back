import { IVaultModel } from '../interfaces';

export type AllVaultsResponseType = {
  vaults: IVaultModel[],
  totalPages: number,
  currentPage: number,
}
