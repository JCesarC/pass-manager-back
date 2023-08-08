import { injectable } from 'inversify';
import { IVaultModel } from '../../../../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import VaultSchema from '../models/VaultSchema';

@injectable()
export class VaultRepository implements IVaultRepository {
  async create(vaultData: IVaultModel): Promise<IVaultModel> {
    return await VaultSchema.create(vaultData);
  }
  async getAll(): Promise<IVaultModel[] | null> {
    return await VaultSchema.find({});
  }
  async getAllVaultsPaginated(page: number, limit: number): Promise<IVaultModel[] | null> {
    return await VaultSchema.find({}, { __v: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }
  async getById(id: string): Promise<IVaultModel | null> {
    return await VaultSchema.findById(id);
  }
  async getByUser(userId: string): Promise<IVaultModel[] | null> {
    return await VaultSchema.find({ user: userId });
  }
  async update(id: string, newVaultData: IVaultModel): Promise<IVaultModel | null> {
    return await VaultSchema.findByIdAndUpdate(id, newVaultData);
  }
  async delete(id: string): Promise<unknown> {
    return await VaultSchema.findByIdAndDelete(id);
  }
  async countDocuments(): Promise<number> {
    return await VaultSchema.countDocuments();
  }
  async query(query: Record<string, unknown>): Promise<IVaultModel[]> {
    return await VaultSchema.find({ query });
  }
  async queryOne(query: Record<string, unknown>): Promise<IVaultModel | null> {
    return await VaultSchema.findOne({ query });
  }

}
