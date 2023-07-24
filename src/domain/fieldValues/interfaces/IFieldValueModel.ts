import { Document } from 'mongoose';
import { IFieldModel } from '../../fields/interfaces';

export interface IFieldValueModel extends Document {
  field: IFieldModel;
  value: string | string[];
  vault: string;
}
