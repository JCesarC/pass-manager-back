import { Document } from 'mongoose';

export interface IOwnedRepository<T extends Document> {
  findOwnedById(id: string, ownerId: string): Promise<T | null>;
  findOwnedPaginated(ownerId: string, page: number, limit: number): Promise<T[]>;
  countOwned(ownerId: string): Promise<number>;
  updateOwned(id: string, ownerId: string, changes: Partial<T>): Promise<T | null>;
  deleteOwned(id: string, ownerId: string): Promise<T | null>;
}
