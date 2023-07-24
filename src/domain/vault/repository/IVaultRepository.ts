import { IVaultModel } from '../interfaces';

export interface IVaultRepository {
  getAll(): Promise<IVaultModel []>;
  getById(id: string): Promise<IVaultModel>;
  getByUser(userId: string): Promise<IVaultModel>;
  update(id: string, newVaultData: IVaultModel): Promise<IVaultModel>;
  delete(id: string): Promise<any>;
  countDocuments(): Promise<number>;
  query(query: Record<string, unknown>): Promise<IVaultModel[]>;
  queryOne(query: Record<string, unknown>): Promise<IVaultModel>;
}
