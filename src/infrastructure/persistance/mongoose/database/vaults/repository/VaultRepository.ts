import { injectable } from 'inversify';
import { IVaultModel } from '../../../../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';

import { BaseRepository } from '../../Base/repository/BaseRepository';
import { Model } from 'mongoose';

@injectable()
export class VaultRepository extends BaseRepository<IVaultModel> implements IVaultRepository {
  constructor(model: Model<IVaultModel>) {
    super(model);
  }

  async getAllVaultsPaginated(page: number, limit: number): Promise<IVaultModel[] | null> {
    return this.model.find({}, { __v: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }

  async getByUser(userId: string): Promise<IVaultModel[] | null> {
    return this.model.find({ user: userId });
  }

  async query(query: Record<string, unknown>): Promise<IVaultModel[]> {
    return this.model.find({ query });
  }

  async queryOne(query: Record<string, unknown>): Promise<IVaultModel | null> {
    return this.model.findOne({ query });
  }

}
