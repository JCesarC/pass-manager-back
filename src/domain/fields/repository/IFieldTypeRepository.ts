import { IFieldTypeModel } from '../interfaces';

export interface IFieldTypeRepository {
  getAll(): Promise<IFieldTypeModel[] | null>;
  getById(id: string): Promise<IFieldTypeModel | null>;
  create(fieldData: IFieldTypeModel): Promise<IFieldTypeModel>;
  delete(id: string): Promise<unknown>
  update(id: string, fieldData: IFieldTypeModel): Promise<IFieldTypeModel | null>;
  query(query: Record<string, unknown>): Promise<IFieldTypeModel[]>;
  queryOne(query: Record<string, unknown>): Promise<IFieldTypeModel | null>;
  upsertByName(name: string): Promise<IFieldTypeModel>;
}
