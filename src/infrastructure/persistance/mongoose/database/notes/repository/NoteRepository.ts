import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { OwnedRepository } from '../../Base/repository/OwnedRepository';
import { INoteModel } from '../../../../../../domain/notes/interfaces';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

@injectable()
export class NoteRepository extends OwnedRepository<INoteModel> implements INoteRepository {
  constructor(model: Model<INoteModel>) {
    super(model);
  }
}
