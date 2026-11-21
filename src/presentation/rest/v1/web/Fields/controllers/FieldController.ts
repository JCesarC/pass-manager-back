import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../../../domain/types';
import { IFieldRepository } from '../../../../../../domain/fields/repository';
import { Body, Get, Post, Route, Tags } from 'tsoa';
import { IFieldModel } from '../../../../../../domain/fields/interfaces';
import { GetAllFieldsUseCase } from '../../../../../../application/Fields/Usecases';
import { CreateFieldUseCase } from '../../../../../../application/Fields/Usecases';
import { fieldValidator } from '../../../../../../application/Fields/FieldValidator';
import { validate } from '../../../../../../application/shared';

@Route('/api/v1/fields')
@Tags('FieldController')
@injectable()
export class FieldController{
  private fieldRepository;
  constructor(@inject(TYPES.IFieldRepository) fieldRepository: IFieldRepository) {
    this.fieldRepository = fieldRepository;
  }

  @Get('/')
  async getAllFields(){
    const getAllFieldsUseCase = new GetAllFieldsUseCase(this.fieldRepository);
    const response = await getAllFieldsUseCase.exec();
    return response;
  }
  @Post('/')
  async createField(@Body() fieldData: IFieldModel){
    const createFieldUseCase = new CreateFieldUseCase(this.fieldRepository);
    const field = validate(fieldValidator, fieldData) as IFieldModel;
    const response = await createFieldUseCase.exec(field);
    return response;
  }

}
