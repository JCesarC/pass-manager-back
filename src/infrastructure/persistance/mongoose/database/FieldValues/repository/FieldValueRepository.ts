import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import { BaseRepository } from '../../Base/repository/BaseRepository';

@injectable()
export class FieldValueRepository extends BaseRepository<IFieldValueModel> implements IFieldValueRepository{
  constructor(model: Model<IFieldValueModel>) {
    super(model);
  }

  async getByVault(vaultId: string): Promise<IFieldValueModel[] | null> {
    return this.model.find({ vault: vaultId });
  }

}
