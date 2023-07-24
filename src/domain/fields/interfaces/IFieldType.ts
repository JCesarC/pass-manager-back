import { Document } from 'mongoose';

export interface IFieldType extends Document {
  name: string;
}
