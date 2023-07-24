import { IFieldValueModel } from '../interfaces';

export interface IFieldValueRepository {
  getAll(): Promise <IFieldValueModel[]>;
  getById(id: string): Promise<IFieldValueModel>;
  getByVault(vaultId: string): Promise<IFieldValueModel[]>
  create(fieldValueData: IFieldValueModel): Promise<IFieldValueModel>;
  update(id: string, fieldValueData: IFieldValueModel): Promise<IFieldValueModel>;
  delete(id: string): Promise<unknown>;
}
