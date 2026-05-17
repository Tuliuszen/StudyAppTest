import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ListMaterialsQueryDto } from './dto/list-materials-query.dto';
import { ListSectionsQueryDto } from './dto/list-sections-query.dto';
import { UploadMaterialDto } from './dto/upload-material.dto';
import { MaterialsService } from './materials.service';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  @Post('upload')
  async upload(@Body() dto: UploadMaterialDto) {
    const material = await this.materialsService.upload(dto.fileName, dto.mimeType ?? 'application/pdf', dto.contentBase64);

    return {
      data: material,
    };
  }

  @Get()
  list(@Query() query: ListMaterialsQueryDto) {
    return {
      data: this.materialsService.list(query),
    };
  }

  @Get(':materialId')
  getById(@Param('materialId') materialId: string) {
    return {
      data: this.materialsService.getById(materialId),
    };
  }

  @Get(':materialId/sections')
  listSections(@Param('materialId') materialId: string, @Query() query: ListSectionsQueryDto) {
    return this.materialsService.listSections(materialId, query.page, query.limit);
  }
}
