import { AllNotesResponseType } from '../types';

export interface IGetAllNotesUseCase {
  exec(ownerId: string, page: number, limit: number): Promise<AllNotesResponseType>;
}
