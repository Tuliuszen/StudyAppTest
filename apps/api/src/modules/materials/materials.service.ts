import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PdfParserService } from './pdf-parser.service';
import type { ListMaterialsQueryDto } from './dto/list-materials-query.dto';
import type { Material, MaterialSection, MaterialStatus } from './types/material.types';

@Injectable()
export class MaterialsService {
  private readonly materials = new Map<string, Material>();
  private readonly sectionsByMaterialId = new Map<string, MaterialSection[]>();

  constructor(private readonly pdfParserService: PdfParserService) {}

  async upload(fileName: string, mimeType: string, contentBase64: string): Promise<Material> {
    const materialId = this.generateId();
    const material: Material = {
      id: materialId,
      fileName,
      mimeType,
      uploadedAt: new Date().toISOString(),
      status: 'queued',
      totalSections: 0,
    };

    this.materials.set(materialId, material);

    const buffer = Buffer.from(contentBase64, 'base64');
    void this.processMaterial(materialId, fileName, buffer);

    return material;
  }

  list(query: ListMaterialsQueryDto): Material[] {
    const records = Array.from(this.materials.values());
    if (!query.status) {
      return records;
    }

    return records.filter((item) => item.status === query.status);
  }

  getById(materialId: string): Material {
    const material = this.materials.get(materialId);
    if (!material) {
      throw new NotFoundException(`Material ${materialId} not found`);
    }

    return material;
  }

  listSections(materialId: string, page: number, limit: number): { data: MaterialSection[]; meta: { page: number; limit: number; total: number } } {
    this.getById(materialId);

    const sections = this.sectionsByMaterialId.get(materialId) ?? [];
    const total = sections.length;
    const startIndex = (page - 1) * limit;
    const data = sections.slice(startIndex, startIndex + limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  private async processMaterial(materialId: string, fileName: string, buffer: Buffer): Promise<void> {
    this.updateStatus(materialId, 'processing');

    try {
      const sections = await this.pdfParserService.extractSections(materialId, fileName, buffer);
      this.sectionsByMaterialId.set(materialId, sections);

      const material = this.getById(materialId);
      material.totalSections = sections.length;
      material.status = 'ready';
      this.materials.set(materialId, material);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown parsing error';
      const material = this.getById(materialId);
      material.status = 'failed';
      material.error = message;
      this.materials.set(materialId, material);
    }
  }

  private updateStatus(materialId: string, status: MaterialStatus): void {
    const material = this.getById(materialId);
    material.status = status;
    this.materials.set(materialId, material);
  }

  private generateId(): string {
    return `mat_${randomUUID()}`;
  }
}
