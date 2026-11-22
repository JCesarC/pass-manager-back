import { IFieldModel } from '../../../../domain/fields/interfaces';
import { IFieldValueModel } from '../../../../domain/fieldValues/interfaces';

export interface Field {
  _id: string;
  name: string;
  type: string;
}

export interface FieldValue {
  _id: string;
  field: Field | string;
  value: string | string[];
  vault: string;
}

export const presentField = (field: IFieldModel): Field => ({
  _id: String(field._id),
  name: field.name,
  type: String((field.type as { _id?: unknown })?._id ?? field.type),
});

export const presentFieldValue = (fieldValue: IFieldValueModel): FieldValue => ({
  _id: String(fieldValue._id),
  field:
    fieldValue.field && typeof fieldValue.field === 'object' && 'name' in fieldValue.field
      ? presentField(fieldValue.field)
      : String(fieldValue.field),
  value: fieldValue.value,
  vault: String(fieldValue.vault),
});
