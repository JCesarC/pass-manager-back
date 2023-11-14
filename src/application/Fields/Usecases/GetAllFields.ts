import { IFieldRepository } from '../../../domain/fields/repository';

export class GetAllFieldsUseCase {
  private fieldRepository;
  constructor (fieldRepository: IFieldRepository) {
    this.fieldRepository = fieldRepository;
  }
  async exec(){
    const fields = await this.fieldRepository.getAll();
    return fields;
  }
}
