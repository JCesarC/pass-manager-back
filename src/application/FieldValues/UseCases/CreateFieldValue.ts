import { IFieldValueModel } from '../../../domain/fieldValues/interfaces';
import { IFieldValueRepository } from '../../../domain/fieldValues/repository/IFieldValueRepository';

export class CreateFieldValueUseCase{
  private fieldValueRepository;

  constructor(fieldValueRepository: IFieldValueRepository){
    this.fieldValueRepository = fieldValueRepository;
  }

  async exec(fieldValueData: IFieldValueModel){
    const createdFieldValue = await this.fieldValueRepository.create(fieldValueData);
    return createdFieldValue;
  }
}
