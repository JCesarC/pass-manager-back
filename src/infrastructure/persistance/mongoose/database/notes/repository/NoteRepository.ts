import { Model } from 'mongoose';
import { injectable } from 'inversify';

import { BaseRepository } from '../../Base/repository/BaseRepository';

import { INoteModel } from '../../../../../../domain/notes/interfaces';
import { INoteRepository } from '../../../../../../domain/notes/repository/INoteRepository';

@injectable()
export class NoteRepository extends BaseRepository<INoteModel> implements INoteRepository{
  constructor(model: Model<INoteModel>) {
    super(model);
  }
  async getNotesByUser(userId: string): Promise<INoteModel[] | null> {
    return this.model.find({ user: userId });
  }
}
