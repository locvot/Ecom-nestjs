import { Controller, Get } from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetLanguagesResDTO } from './language.dto';
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
}
