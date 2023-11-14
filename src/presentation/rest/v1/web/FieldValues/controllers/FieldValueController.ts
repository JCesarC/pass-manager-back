import { inject, injectable } from 'inversify';
import { Body, Get, Post, Route, Tags } from 'tsoa';

import { TYPES } from '../../../../../../domain/types';
import { IFieldValueRepository } from '../../../../../../domain/fieldValues/repository/IFieldValueRepository';
import { IFieldValueModel } from '../../../../../../domain/fieldValues/interfaces';

import { CreateFieldValueUseCase, GetAllFieldValuesUseCase } from '../../../../../../application/FieldValues/UseCases';

@Route('/api/v1/fieldvalues')
@Tags('FieldValueController')
@injectable()
export class FieldValueController{
  private fieldValueRepository;
  constructor(@inject(TYPES.IFieldValueRepository) fieldValueRepository: IFieldValueRepository){
    this.fieldValueRepository = fieldValueRepository;
  }
  //! Disable or hide enpoit after tests
  @Get('/')
  async getAllFieldValues(){
    const getAllFieldValuesUseCase = new GetAllFieldValuesUseCase(this.fieldValueRepository);
    const response = await getAllFieldValuesUseCase.exec();
    return response;
  }

  @Post('/')
  async createFieldValue(@Body()fieldValueData: IFieldValueModel ){
    const createFieldValueUseCase = new CreateFieldValueUseCase(this.fieldValueRepository);
    const response = await createFieldValueUseCase.exec(fieldValueData);
    return response;
  }
}
