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

}
