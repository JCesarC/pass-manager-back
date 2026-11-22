import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { IVaultModel } from '../../../../../../domain/vaults/interfaces';
import { IVaultRepository } from '../../../../../../domain/vaults/repository/IVaultRepository';
import { OwnedRepository } from '../../Base/repository/OwnedRepository';

@injectable()
export class VaultRepository extends OwnedRepository<IVaultModel> implements IVaultRepository {
  constructor(model: Model<IVaultModel>) {
    super(model);
  }

  async addExtraField(vaultId: string, fieldValueId: string): Promise<void> {
    await this.model.updateOne({ _id: vaultId }, { $addToSet: { extraFields: fieldValueId } });
  }
}
