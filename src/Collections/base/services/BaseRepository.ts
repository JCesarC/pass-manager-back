import { Model } from 'mongoose';
import { IBaseRepository } from '../model/IBaseRepository';

export class BaseRepository implements IBaseRepository {
  public model;
  // * TODO: Type for model [unknown]
  // * TODO: Type for entity [any]
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor( baseModel: Model<any>){
    this.model = baseModel;
  }

  async getAll(): Promise<unknown> {
    // const data = this.model.
    return await this.model.find({});
  };

  async getById(id: string): Promise<unknown> {
    return await this.model.findById(id);
  }

  async create(entity: any): Promise<unknown> {
    return await this.model.create(entity);
  }

  async update(id: string, entity: any): Promise<unknown> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true });
  }

  async delete(id:string): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return true;
  };

  async countDocuments(): Promise<any> {
    return await this.model.countDocuments();
  }
};
