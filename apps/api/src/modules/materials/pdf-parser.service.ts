import { Injectable } from '@nestjs/common';
import type { MaterialSection } from './types/material.types';

const MIN_CONTENT_LENGTH = 20;
const DEFAULT_CHUNK_SIZE = 1800;
const EASY_DIFFICULTY_THRESHOLD = 400;
const MEDIUM_DIFFICULTY_THRESHOLD = 1400;

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
    if (utf.length >= MIN_CONTENT_LENGTH) {
      return utf;
    }

    const latin1 = buffer.toString('latin1').replace(/\0/g, '').trim();
    if (latin1.length >= MIN_CONTENT_LENGTH) {
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

    const fallback = normalized
      .match(new RegExp(`.{1,${DEFAULT_CHUNK_SIZE}}(?:\\s|$)`, 'g'))
      ?.map((chunk) => chunk.trim())
      .filter(Boolean) ?? [];

    return fallback.length > 0 ? fallback : ['Brak treści do podziału na sekcje.'];
  }

  private classifyDifficulty(content: string): 'easy' | 'medium' | 'hard' {
    const length = content.length;
    if (length < EASY_DIFFICULTY_THRESHOLD) {
      return 'easy';
    }
    if (length < MEDIUM_DIFFICULTY_THRESHOLD) {
      return 'medium';
    }
    return 'hard';
  }

  private buildSectionTitle(fileName: string, sectionOrder: number): string {
    return `${fileName} — Sekcja ${sectionOrder}`;
  }
}
