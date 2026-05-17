import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { PdfParserService } from './pdf-parser.service';

@Module({
  controllers: [MaterialsController],
  providers: [MaterialsService, PdfParserService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
