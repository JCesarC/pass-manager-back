import { IVaultModel } from '../../../../../../domain/vault/interfaces';
import { IVaultRepository } from '../../../../../../domain/vault/repository/IVaultRepository';

export class VaultRepository implements IVaultRepository {
  getAll(): Promise<IVaultModel[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<IVaultModel> {
    throw new Error('Method not implemented.');
  }
  getByUser(userId: string): Promise<IVaultModel> {
    throw new Error('Method not implemented.');
  }
  update(id: string, newVaultData: IVaultModel): Promise<IVaultModel> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
  countDocuments(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  query(query: Record<string, unknown>): Promise<IVaultModel[]> {
    throw new Error('Method not implemented.');
  }
  queryOne(query: Record<string, unknown>): Promise<IVaultModel> {
    throw new Error('Method not implemented.');
  }

}
