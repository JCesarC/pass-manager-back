import { DEFAULT_FIELD_TYPES, DEFAULT_FIELDS } from '../../../domain/fields/defaultFieldCatalog';
import { IFieldRepository, IFieldTypeRepository } from '../../../domain/fields/repository';

export class SeedFieldCatalogUseCase {
  constructor(
    private readonly fieldTypeRepository: IFieldTypeRepository,
    private readonly fieldRepository: IFieldRepository,
  ) {}

  async exec(): Promise<void> {
    const typeIds = new Map<string, string>();
    for (const typeName of DEFAULT_FIELD_TYPES) {
      const type = await this.fieldTypeRepository.upsertByName(typeName);
      typeIds.set(typeName, String(type._id));
    }

    for (const field of DEFAULT_FIELDS) {
      await this.fieldRepository.upsertByName(field.name, typeIds.get(field.type) as string);
    }
  }
}
