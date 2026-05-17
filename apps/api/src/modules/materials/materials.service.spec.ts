import { MaterialsService } from './materials.service';
import { PdfParserService } from './pdf-parser.service';

describe('MaterialsService', () => {
  it('creates material and eventually marks it as ready with sections', async () => {
    const parser = new PdfParserService();
    const service = new MaterialsService(parser);

    const contentBase64 = Buffer.from('Temat 1\n\nTo jest testowy materiał.').toString('base64');
    const material = await service.upload('test.pdf', 'application/pdf', contentBase64);

    expect(material.status).toBe('queued');

    const saved = await waitForReadyMaterial(service, material.id);
    expect(saved.status).toBe('ready');
    expect(saved.totalSections).toBeGreaterThan(0);
  });
});

async function waitForReadyMaterial(service: MaterialsService, materialId: string, timeoutMs = 500): Promise<ReturnType<MaterialsService['getById']>> {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const material = service.getById(materialId);
    if (material.status === 'ready' || material.status === 'failed') {
      return material;
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  return service.getById(materialId);
}
