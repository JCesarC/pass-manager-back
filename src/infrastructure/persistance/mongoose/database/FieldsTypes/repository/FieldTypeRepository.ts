import { injectable } from 'inversify';
import { IFieldTypeModel } from '../../../../../../domain/fields/interfaces';
import { IFieldTypeRepository } from '../../../../../../domain/fields/repository';

import FieldTypeSchema from '../models/FieldTypeSchema';

@injectable()
export class FieldTypeRepository implements IFieldTypeRepository {
  async getAll(): Promise<IFieldTypeModel[] | null> {
    return await FieldTypeSchema.find({});
  }
  async getById(id: string): Promise<IFieldTypeModel | null> {
    return await FieldTypeSchema.findById(id);
  }
  async create(fieldData: IFieldTypeModel): Promise<IFieldTypeModel> {
    return await FieldTypeSchema.create(fieldData);
  }
  async delete(id: string): Promise<unknown> {
    return await FieldTypeSchema.findByIdAndDelete(id);
  }
  async update(id: string, fieldData: IFieldTypeModel): Promise<IFieldTypeModel | null> {
    return await FieldTypeSchema.findByIdAndUpdate(id, fieldData);
  }
  async query(query: Record<string, unknown>): Promise<IFieldTypeModel[]> {
    return await FieldTypeSchema.find({ query });
  }
  async queryOne(query: Record<string, unknown>): Promise<IFieldTypeModel | null> {
    return await FieldTypeSchema.findOne({ query });
  }

}
