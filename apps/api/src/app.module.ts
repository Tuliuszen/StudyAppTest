import { Module } from '@nestjs/common';
import { MaterialsModule } from './modules/materials/materials.module';

@Module({
  imports: [MaterialsModule],
})
export class AppModule {}
