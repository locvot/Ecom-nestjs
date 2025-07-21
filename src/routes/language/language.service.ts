import { Injectable } from '@nestjs/common';
import { LanguageRepo } from './language.repo';
import { NotFoundRecordException } from 'src/shared/dtos/error';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  async findAll() {
    const data = await this.languageRepo.findAll()
    return {data,totalItems: data.length}
  }

  async findById(id:string) {
    const language = await this.languageRepo.findById(id)
    if (!language) {
      throw NotFoundRecordException
    }
    return language
  }
}
