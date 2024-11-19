import { IBaseRepository } from '../../base/repository/IBaseRepository';
import { IVaultModel } from '../interfaces';

export interface IVaultRepository extends IBaseRepository<IVaultModel> {
  create(vaultData: IVaultModel): Promise<IVaultModel>;
  getAllVaultsPaginated(page: number, limit: number): Promise<IVaultModel[] | null>
  getById(id: string): Promise<IVaultModel | null>;
  getByUser(userId: string): Promise<IVaultModel[] | null>;
  update(id: string, newVaultData: IVaultModel): Promise<IVaultModel | null>;
  delete(id: string): Promise<any>;
  countDocuments(): Promise<number>;
  query(query: Record<string, unknown>): Promise<IVaultModel[]>;
  queryOne(query: Record<string, unknown>): Promise<IVaultModel | null>;
}
