import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PDFImageOptions {
  scale?: number;
  maxPages?: number;
}

const renderPageToCanvas = async (page: pdfjsLib.PDFPageProxy, scale: number): Promise<HTMLCanvasElement> => {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Failed to get canvas 2d context');
  }

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  const renderContext: any = {
    canvasContext: context,
    viewport: viewport,
  };
  
  await page.render(renderContext).promise;
  return canvas;
};

export const convertPDFToImages = async (
  file: File,
  options: PDFImageOptions = {}
): Promise<string[]> => {
  const { scale = 2.0, maxPages = 3 } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const images: string[] = [];
  const pagesToProcess = Math.min(pdf.numPages, maxPages);

  for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const canvas = await renderPageToCanvas(page, scale);
    const base64Image = canvas.toDataURL('image/png');
    const base64Data = base64Image.split(',')[1];
    images.push(base64Data);
  }

  return images;
};

export const convertPDFToDataURLs = async (
  file: File,
  options: PDFImageOptions = {}
): Promise<string[]> => {
  const { scale = 2.0, maxPages = 3 } = options;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const images: string[] = [];
  const pagesToProcess = Math.min(pdf.numPages, maxPages);

  for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const canvas = await renderPageToCanvas(page, scale);
    images.push(canvas.toDataURL('image/png'));
  }

  return images;
};
