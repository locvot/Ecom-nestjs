import { Injectable } from '@nestjs/common';
import { LanguageRepo } from './language.repo';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}
  
  async findAll() {
    const data = await this.languageRepo.findAll()
    return {data,totalItems: data.length}
  }
}
