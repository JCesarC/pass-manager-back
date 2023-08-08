import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

import FieldValueSchema from '../models/FieldValueSchema';

export class FieldValueRepository implements IFieldValueRepository{
  async getAll(): Promise<IFieldValueModel[] | null> {
    return await FieldValueSchema.find({});
  }
  async getById(id: string): Promise<IFieldValueModel | null> {
    return await FieldValueSchema.findById(id);
  }
  async getByVault(vaultId: string): Promise<IFieldValueModel[] | null> {
    return await FieldValueSchema.find({ vault: vaultId });
  }
  async create(fieldValueData: IFieldValueModel): Promise<IFieldValueModel> {
    return await FieldValueSchema.create(fieldValueData);
  }
  async update(id: string, fieldValueData: IFieldValueModel): Promise<IFieldValueModel | null> {
    return await FieldValueSchema.findByIdAndUpdate(id, fieldValueData);
  }
  async delete(id: string): Promise<unknown> {
    return await FieldValueSchema.findByIdAndDelete(id);
  }
  async query(query: Record<string, unknown>): Promise<IFieldValueModel[]> {
    return await FieldValueSchema.find({ query });
  }

}
