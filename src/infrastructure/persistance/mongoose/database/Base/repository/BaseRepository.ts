import { Document, Model } from 'mongoose';

import { IBaseRepository } from '../../../../../../domain/base/repository/IBaseRepository';

export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async countDocuments(): Promise<number> {
    return this.model.countDocuments();
  }

  async create(entity: T): Promise<T> {
    return this.model.create(entity);
  }

  async getAll(): Promise<T[]> {
    return this.model.find({});
  }

  async getById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async update(id: string, updatedEntity: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, updatedEntity, { new: true });
  }

  async delete(id: string): Promise<unknown> {
    return this.model.findByIdAndDelete(id);
  }

  async query(query: Record<string, unknown>): Promise<T[]> {
    return this.model.find({ query });
  }

  async queryOne(query: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne({ query });
  }

  async getDocumentsPaginated(page: number, limit: number): Promise<T[] | null> {
    return this.model.find({}, { __v: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }
}
