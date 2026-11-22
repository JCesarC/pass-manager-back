import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { IFieldTypeModel } from '../../../../../../domain/fields/interfaces';
import { IFieldTypeRepository } from '../../../../../../domain/fields/repository';

import { BaseRepository } from '../../Base/repository/BaseRepository';

@injectable()
export class FieldTypeRepository extends BaseRepository<IFieldTypeModel> implements IFieldTypeRepository {
  constructor(model: Model<IFieldTypeModel>) {
    super(model);
  }

  async upsertByName(name: string): Promise<IFieldTypeModel> {
    const document = await this.model.findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { upsert: true, new: true },
    );
    return document as IFieldTypeModel;
  }
}
