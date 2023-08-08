import { IFieldValueModel } from '../interfaces';

export interface IFieldValueRepository {
  getAll(): Promise <IFieldValueModel[] | null>;
  getById(id: string): Promise<IFieldValueModel | null>;
  getByVault(vaultId: string): Promise<IFieldValueModel[] | null>
  create(fieldValueData: IFieldValueModel): Promise<IFieldValueModel>;
  update(id: string, fieldValueData: IFieldValueModel): Promise<IFieldValueModel | null>;
  delete(id: string): Promise<unknown>;
  query(query: Record<string, unknown>): Promise<IFieldValueModel[]>;
}
