import { AllVaultsResponseType } from '../types';

export interface IGetAllVaultsUseCase {
  exec(page: number, limit: number): Promise<AllVaultsResponseType>;
}
