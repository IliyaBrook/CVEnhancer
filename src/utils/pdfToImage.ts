import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export interface PDFImageOptions {
  scale?: number; // Scaling factor for rendering (default: 2.0 for high quality)
  maxPages?: number; // Maximum number of pages to convert (default: 3)
}

/**
 * Convert PDF file to base64 images
 * @param file PDF file to convert
 * @param options Conversion options
 * @returns Array of base64 image strings (without data:image prefix for Ollama)
 */
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
    const viewport = page.getViewport({ scale });

    // Create canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to get canvas 2d context');
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page to canvas
    const renderContext: any = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Convert canvas to base64
    const base64Image = canvas.toDataURL('image/png');

    // For Ollama, remove the data:image/png;base64, prefix
    const base64Data = base64Image.split(',')[1];
    images.push(base64Data);
  }

  return images;
};

/**
 * Convert PDF file to base64 images with full data URL (for OpenAI/Claude)
 * @param file PDF file to convert
 * @param options Conversion options
 * @returns Array of full base64 data URLs
 */
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

    images.push(canvas.toDataURL('image/png'));
  }

  return images;
};
