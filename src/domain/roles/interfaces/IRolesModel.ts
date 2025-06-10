import { Document } from 'mongoose';
import { IModule } from '../../modules/interfaces';

export interface IRoleModel extends Document {
  name: string;
  company: string;
  permissions: string[];
  modules: IModule[];
}
