import { IsBase64, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fileName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  mimeType?: string;

  @IsString()
  @IsBase64()
  contentBase64!: string;
}
