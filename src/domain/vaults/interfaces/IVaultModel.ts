import { Document } from 'mongoose';
import { IUserModel } from '../../users/interfaces';
import { IFieldValueModel } from '../../fieldValues/interfaces';

export interface IVaultModel extends Document {
  user: IUserModel;
  name: string;
  data: string;
  dataFieldType: string;
  isFavorite: boolean;
  tags: string[];
  isArchived: boolean;
  expirationDate: Date | null;
  attachments?: string[];
  extraFields?: IFieldValueModel[];
}
