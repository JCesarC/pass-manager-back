import { IFieldValueRepository } from '../../../domain/fieldValues/repository/IFieldValueRepository';

export class GetAllFieldValuesUseCase {
  private fieldValueRepository;
  constructor(fieldValueRepository: IFieldValueRepository){
    this.fieldValueRepository = fieldValueRepository;
  }

  async exec() {
    const fieldValues = await this.fieldValueRepository.getAll();
    return fieldValues;
  }
}
