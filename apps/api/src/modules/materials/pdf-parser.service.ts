import { Injectable } from '@nestjs/common';
import type { MaterialSection } from './types/material.types';

@Injectable()
export class PdfParserService {
  async extractSections(materialId: string, fileName: string, buffer: Buffer): Promise<MaterialSection[]> {
    const content = this.decodeContent(buffer);
    const rawSections = this.splitIntoSections(content);

    return rawSections.map((sectionContent, index) => ({
      id: `${materialId}-section-${index + 1}`,
      materialId,
      order: index + 1,
      title: this.buildSectionTitle(fileName, index + 1),
      content: sectionContent,
      sourcePageStart: index + 1,
      sourcePageEnd: index + 1,
      estimatedDifficulty: this.classifyDifficulty(sectionContent),
    }));
  }

  private decodeContent(buffer: Buffer): string {
    const utf = buffer.toString('utf8').replace(/\0/g, '').trim();
    if (utf.length >= 20) {
      return utf;
    }

    const latin1 = buffer.toString('latin1').replace(/\0/g, '').trim();
    if (latin1.length >= 20) {
      return latin1;
    }

    return 'Brak możliwej do ekstrakcji treści tekstowej z pliku PDF.';
  }

  private splitIntoSections(content: string): string[] {
    const normalized = content.replace(/\r\n/g, '\n');
    const candidates = normalized
      .split(/\n{2,}|(?=\n(?:Rozdział|Chapter|Section|Temat)\s+\d+)/gi)
      .map((part) => part.trim())
      .filter(Boolean);

    if (candidates.length > 0) {
      return candidates;
    }

    const fallback = normalized.match(/.{1,1800}(?:\s|$)/g)?.map((chunk) => chunk.trim()).filter(Boolean) ?? [];
    return fallback.length > 0 ? fallback : ['Brak treści do podziału na sekcje.'];
  }

  private classifyDifficulty(content: string): 'easy' | 'medium' | 'hard' {
    const length = content.length;
    if (length < 400) {
      return 'easy';
    }
    if (length < 1400) {
      return 'medium';
    }
    return 'hard';
  }

  private buildSectionTitle(fileName: string, sectionOrder: number): string {
    return `${fileName} — Sekcja ${sectionOrder}`;
  }
}
