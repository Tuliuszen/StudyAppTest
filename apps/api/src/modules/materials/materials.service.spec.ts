import { MaterialsService } from './materials.service';
import { PdfParserService } from './pdf-parser.service';

describe('MaterialsService', () => {
  it('creates material and eventually marks it as ready with sections', async () => {
    const parser = new PdfParserService();
    const service = new MaterialsService(parser);

    const contentBase64 = Buffer.from('Temat 1\n\nTo jest testowy materiał.').toString('base64');
    const material = await service.upload('test.pdf', 'application/pdf', contentBase64);

    expect(material.status).toBe('queued');

    await new Promise((resolve) => setTimeout(resolve, 0));

    const saved = service.getById(material.id);
    expect(saved.status).toBe('ready');
    expect(saved.totalSections).toBeGreaterThan(0);
  });
});
