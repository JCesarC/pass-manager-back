import { AllNotesResponseType } from '../types';

export interface IGetAllNotesUseCase {
  exec(page: number, limit: number): Promise<AllNotesResponseType>
};
