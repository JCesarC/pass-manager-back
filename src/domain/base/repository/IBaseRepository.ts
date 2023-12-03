import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: T): Promise<T>;
  getAll(): Promise<T[] | null>;
  getById(id: string): Promise<T | null>;
  update(id: string, newData: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<unknown>;
  countDocuments(): Promise<number>;
  getDocumentsPaginated(page: number, limit: number): Promise<T[] | null>
  // Otros métodos comunes para los repositorios
}
