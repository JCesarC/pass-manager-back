import { IFieldModel } from '../../../domain/fields/interfaces';
import { IFieldRepository } from '../../../domain/fields/repository';

export class CreateFieldUseCase {
  private fieldRepository;
  constructor (fieldRepository: IFieldRepository) {
    this.fieldRepository = fieldRepository;
  }

  async exec(fieldData: IFieldModel){
    const createdField = await this.fieldRepository.create(fieldData);
    return createdField;
  }
}
