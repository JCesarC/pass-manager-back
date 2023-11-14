import { Document } from 'mongoose';
import { IFieldTypeModel } from './IFieldType';

export interface IFieldModel extends Document{
  name: string;
  type: IFieldTypeModel
}
