import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import type { SupportedFileType, ParsedResumeData, AIConfig } from '@/types';
import { convertPDFToImages, convertPDFToDataURLs } from './pdfToImage';
import { isVisionModel, getRecommendedScale, getMaxPages } from './modelDetection';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/**
 * Get the model name for the current provider
 */
const getModelForProvider = (config?: AIConfig): string | undefined => {
  if (!config) return undefined;

  switch (config.provider) {
    case 'openai':
      return config.models?.openai;
    case 'claude':
      return config.models?.claude;
    case 'ollama':
      return config.models?.ollama;
    default:
      return undefined;
  }
};

/**
 * Parse file with support for both text and vision modes
 * @param file File to parse
 * @param fileType Type of the file
 * @param config AI configuration to determine if vision mode should be used
 * @returns Parsed resume data (text or images)
 */
export const parseFile = async (
  file: File,
  fileType: SupportedFileType,
  config?: AIConfig
): Promise<ParsedResumeData> => {
  const useVision = config ? isVisionModel(getModelForProvider(config), config.provider) : false;

  switch (fileType) {
    case 'pdf':
      return parsePDF(file, useVision, config);
    case 'docx':
      return parseDOCX(file);
    case 'jpeg':
    case 'png':
      return parseImage(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
};

const parsePDF = async (file: File, useVision: boolean = false, config?: AIConfig): Promise<ParsedResumeData> => {
  if (useVision) {
    // Vision mode: convert PDF to images
    const scale = getRecommendedScale(getModelForProvider(config));
    const maxPages = getMaxPages(getModelForProvider(config));

    console.log(`[Vision Mode] Converting PDF to images (scale: ${scale}, maxPages: ${maxPages})`);

    const images = await convertPDFToImages(file, { scale, maxPages });
    const dataURLs = await convertPDFToDataURLs(file, { scale, maxPages });

    return {
      images,
      dataURLs,
      isVisionMode: true,
    };
  }

  // Text mode: extract text from PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return {
    text: fullText.trim(),
    isVisionMode: false,
  };
};

const parseDOCX = async (file: File): Promise<ParsedResumeData> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return {
    text: result.value.trim(),
    isVisionMode: false,
  };
};

const parseImage = async (file: File): Promise<ParsedResumeData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataURL = reader.result as string;
      const base64Data = dataURL.split(',')[1]; // Remove data:image prefix

      resolve({
        images: [base64Data],
        dataURLs: [dataURL],
        isVisionMode: true,
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
};
