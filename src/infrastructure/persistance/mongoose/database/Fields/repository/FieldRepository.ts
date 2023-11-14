import { injectable } from 'inversify';
import { IFieldModel } from '../../../../../../domain/fields/interfaces';
import { IFieldRepository } from '../../../../../../domain/fields/repository';

import FieldSchema from '../models/FieldSchema';

@injectable()
export class FieldRepository implements IFieldRepository {
  async getAll(): Promise<IFieldModel[] | null> {
    return await FieldSchema.find({});
  }
  async getById(id: string): Promise<IFieldModel | null> {
    return await FieldSchema.findById(id);
  }
  async create(fieldData: IFieldModel): Promise<IFieldModel> {
    return await FieldSchema.create(fieldData);
  }
  async delete(id: string): Promise<unknown> {
    return await FieldSchema.findByIdAndDelete(id);
  }
  async update(id: string, fieldData: IFieldModel): Promise<IFieldModel | null> {
    return await FieldSchema.findByIdAndUpdate(id, fieldData);
  }
  async query(query: Record<string, unknown>): Promise<IFieldModel[]> {
    return await FieldSchema.find({ query });
  }
  async queryOne(query: Record<string, unknown>): Promise<IFieldModel | null> {
    return await FieldSchema.findOne({ query });
  }

}
