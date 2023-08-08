import { Document } from 'mongoose';
import { IFieldType } from './IFieldType';

export interface IFieldModel extends Document{
  name: string;
  type: IFieldType
}
