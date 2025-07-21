import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/services/prisma.service";
import { LanguageType } from "./language.model";

@Injectable()
export class LanguageRepo {
  constructor (
    private prismaService: PrismaService
  ) {}

  findAll(): Promise<LanguageType[]> {
    return this.prismaService.language.findMany({
      where: {
        deletedAt: null
      }
    })
  }
}