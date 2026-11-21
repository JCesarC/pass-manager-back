import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IOwnedRepository } from '../../../../../../domain/base/repository/IOwnedRepository';
import { BaseRepository } from './BaseRepository';

/** Base repository for resources that belong to a user through an owner field. */
export abstract class OwnedRepository<T extends Document>
  extends BaseRepository<T>
  implements IOwnedRepository<T> {

  constructor(model: Model<T>, private readonly ownerField = 'user') {
    super(model);
  }

  private owned(ownerId: string, id?: string): FilterQuery<T> {
    return { [this.ownerField]: ownerId, ...(id && { _id: id }) } as FilterQuery<T>;
  }

  async findOwnedById(id: string, ownerId: string): Promise<T | null> {
    return this.model.findOne(this.owned(ownerId, id), { __v: 0 });
  }

  async findOwnedPaginated(ownerId: string, page: number, limit: number): Promise<T[]> {
    return this.model
      .find(this.owned(ownerId), { __v: 0 })
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countOwned(ownerId: string): Promise<number> {
    return this.model.countDocuments(this.owned(ownerId));
  }

  async updateOwned(id: string, ownerId: string, changes: Partial<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(
      this.owned(ownerId, id),
      { $set: changes } as UpdateQuery<T>,
      { new: true, runValidators: true, projection: { __v: 0 } },
    );
  }

  async deleteOwned(id: string, ownerId: string): Promise<T | null> {
    return this.model.findOneAndDelete(this.owned(ownerId, id));
  }
}
