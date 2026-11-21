import { Document } from 'mongoose';

/**
 * Queries scoped to the owner of a resource. Every read and write of a
 * user's data goes through these methods, so a resource that belongs to
 * someone else is indistinguishable from one that does not exist.
 */
export interface IOwnedRepository<T extends Document> {
  findOwnedById(id: string, ownerId: string): Promise<T | null>;
  findOwnedPaginated(ownerId: string, page: number, limit: number): Promise<T[]>;
  countOwned(ownerId: string): Promise<number>;
  updateOwned(id: string, ownerId: string, changes: Partial<T>): Promise<T | null>;
  deleteOwned(id: string, ownerId: string): Promise<T | null>;
}
