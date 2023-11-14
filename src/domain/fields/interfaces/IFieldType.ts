import { Document } from 'mongoose';

export interface IFieldTypeModel extends Document {
  name: string;
}
