import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { IRoleModel } from '../../../../../../domain/roles/interfaces';
import { BaseRepository } from '../../Base/repository/BaseRepository';

@injectable()
export class RoleRepository extends BaseRepository<IRoleModel> {
  constructor(model: Model<IRoleModel>) {
    super(model);
  }
}
