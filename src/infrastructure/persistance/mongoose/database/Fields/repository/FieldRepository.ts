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

}
