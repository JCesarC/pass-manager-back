import { injectable } from 'inversify';
import { IFieldModel } from '../../../../../../domain/fields/interfaces';
import { IFieldRepository } from '../../../../../../domain/fields/repository';

import { Model } from 'mongoose';
import { BaseRepository } from '../../Base/repository/BaseRepository';

@injectable()
export class FieldRepository extends BaseRepository<IFieldModel> implements IFieldRepository {
  constructor(model: Model<IFieldModel>) {
    super(model);
  }

  async upsertByName(name: string, typeId: string): Promise<IFieldModel> {
    const document = await this.model.findOneAndUpdate(
      { name },
      { $setOnInsert: { name, type: typeId } },
      { upsert: true, new: true },
    );
    return document as IFieldModel;
  }
}
