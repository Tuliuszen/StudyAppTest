import { IsIn, IsOptional, IsString } from 'class-validator';
import type { MaterialStatus } from '../types/material.types';

export class ListMaterialsQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['queued', 'processing', 'ready', 'failed'])
  status?: MaterialStatus;
}
