import { IFieldModel } from '../interfaces';

export interface IFieldRepository {
  getAll(): Promise<IFieldModel[]>;
  getById(id: string): Promise<IFieldModel>;
  create(fieldData: IFieldModel): Promise<IFieldModel>;
  delete(id: string): Promise<unknown>
  update(id: string, fieldData: IFieldModel): Promise<IFieldModel>;
  query(query: Record<string, unknown>): Promise<IFieldModel[]>;
  queryOne(query: Record<string, unknown>): Promise<IFieldModel>;
}
