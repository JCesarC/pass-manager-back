import { IFieldModel } from '../interfaces';

export interface IFieldRepository {
  getAll(): Promise<IFieldModel[] | null>;
  getById(id: string): Promise<IFieldModel | null>;
  create(fieldData: IFieldModel): Promise<IFieldModel>;
  delete(id: string): Promise<unknown>
  update(id: string, fieldData: IFieldModel): Promise<IFieldModel | null>;
  query(query: Record<string, unknown>): Promise<IFieldModel[]>;
  queryOne(query: Record<string, unknown>): Promise<IFieldModel | null>;
}
