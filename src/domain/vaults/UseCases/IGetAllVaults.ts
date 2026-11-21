import { AllVaultsResponseType } from '../types';

export interface IGetAllVaultsUseCase {
  exec(ownerId: string, page: number, limit: number): Promise<AllVaultsResponseType>;
}
