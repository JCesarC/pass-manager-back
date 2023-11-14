import { IFieldRepository } from '../../../domain/fields/repository';

export class GetFieldByIdUseCase {
  private fieldRepository;
  constructor (fieldRepository: IFieldRepository) {
    this.fieldRepository = fieldRepository;
  }

  async exec(id: string) {
    return await this.fieldRepository.getById(id);
  }
}
