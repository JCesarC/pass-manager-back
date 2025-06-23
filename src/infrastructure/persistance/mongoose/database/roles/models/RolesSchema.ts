import mongoose, { Schema } from 'mongoose';
import { IRoleModel } from '../../../../../../domain/roles/interfaces';

const rolesSchema: Schema = new Schema<IRoleModel>({
  name: {
    type: String,
    required: true
  }
});

export default mongoose.model('Role', rolesSchema);
