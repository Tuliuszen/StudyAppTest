export type MaterialStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface MaterialSection {
  id: string;
  materialId: string;
  order: number;
  title: string;
  content: string;
  sourcePageStart: number;
  sourcePageEnd: number;
  estimatedDifficulty: 'easy' | 'medium' | 'hard';
}

export interface Material {
  id: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  status: MaterialStatus;
  totalSections: number;
  error?: string;
}
