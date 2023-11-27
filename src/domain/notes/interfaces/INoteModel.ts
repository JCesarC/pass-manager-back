import { Document } from 'mongoose';
import { IUserModel } from '../../users/interfaces';

export interface INoteModel extends Document {
  user: IUserModel;
  title: string;
  body: string;
  isFavorite: boolean;
  isArchived: boolean;
  tags: string[];
}
