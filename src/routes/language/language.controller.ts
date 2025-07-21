import { Controller, Get, Param } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetLanguageDetailResDTO, GetLanguageParamsDTO, GetLanguagesResDTO } from './language.dto';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService
  ) {}

  @Get()
  @ZodSerializerDto(GetLanguagesResDTO)
  findAll() {
    return this.languageService.findAll()
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageDetailResDTO)
  findById(@Param() params: GetLanguageParamsDTO) {
    return this.languageService.findById(params.languageId)
  }
}
