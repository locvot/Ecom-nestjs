import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateProductTranslationBodyDTO,
  GetProductTranslationDetailResDTO,
  GetProductTranslationParamsDTO,
  UpdateProductTranslationBodyDTO,
} from './product-translation.dto'
import { ProductTranslationService } from './product-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Get(':prodcutTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  findById(@Param() params: GetProductTranslationParamsDTO) {
    return this.productTranslationService.findById(params.productTranslationId)
  }

  @Post()
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  create(@Body() body: CreateProductTranslationBodyDTO, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create({ data: body, createdById: userId })
  }

  @Put(':prodcutTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDTO)
  update(
    @Body() body: UpdateProductTranslationBodyDTO,
    @Param() params: GetProductTranslationParamsDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.productTranslationService.update({
      data: body,
      id: params.productTranslationId,
      updatedById: userId,
    })
  }

  @Delete(':prodcutTranslationId')
  @ZodSerializerDto(MessageResDTO)
  delete(@Param() params: GetProductTranslationParamsDTO, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.delete({ id: params.productTranslationId, deletedById: userId })
  }
}
