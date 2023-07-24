import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';

export class FieldValueRepository implements IFieldValueRepository{
  getAll(): Promise<IFieldValueModel[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<IFieldValueModel> {
    throw new Error('Method not implemented.');
  }
  getByVault(vaultId: string): Promise<IFieldValueModel[]> {
    throw new Error('Method not implemented.');
  }
  create(fieldValueData: IFieldValueModel): Promise<IFieldValueModel> {
    throw new Error('Method not implemented.');
  }
  update(id: string, fieldValueData: IFieldValueModel): Promise<IFieldValueModel> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

}
