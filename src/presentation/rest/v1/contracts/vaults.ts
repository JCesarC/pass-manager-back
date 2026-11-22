import { IVaultModel } from '../../../../domain/vaults/interfaces';
import { FieldValue, presentFieldValue } from './fields';

export interface Vault {
  _id: string;
  user: string;
  name: string;
  data: string;
  dataFieldType: string;
  isFavorite: boolean;
  tags: string[];
  isArchived: boolean;
  expirationDate: Date | null;
  extraFields: FieldValue[];
}

export interface VaultPage {
  vaults: Vault[];
  totalPages: number;
  currentPage: number;
}

export const presentVault = (vault: IVaultModel): Vault => ({
  _id: String(vault._id),
  user: String(vault.user),
  name: vault.name,
  data: vault.data,
  dataFieldType: vault.dataFieldType,
  isFavorite: Boolean(vault.isFavorite),
  tags: vault.tags ?? [],
  isArchived: Boolean(vault.isArchived),
  expirationDate: vault.expirationDate ?? null,
  extraFields: (vault.extraFields ?? []).map(presentFieldValue),
});
