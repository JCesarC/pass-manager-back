
// * TODO: fix promise type [unknown]
export interface IBaseRepository {

  getAll(): Promise<unknown>;
  getById(id: string): Promise<unknown>;
  create(entity: any): Promise<unknown>;
  update(id: string, entity: any) : Promise<unknown>;
  delete(id: string): Promise<any>;
};
