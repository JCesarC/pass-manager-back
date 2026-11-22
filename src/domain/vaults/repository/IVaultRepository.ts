import { IBaseRepository } from '../../base/repository/IBaseRepository';
import { IOwnedRepository } from '../../base/repository/IOwnedRepository';
import { IVaultModel } from '../interfaces';

export interface IVaultRepository extends IBaseRepository<IVaultModel>, IOwnedRepository<IVaultModel> {
  addExtraField(vaultId: string, fieldValueId: string): Promise<void>;
}
