import type { SupportedFileType, FileValidationResult } from '@/types';

const SUPPORTED_TYPES: SupportedFileType[] = ['pdf', 'docx', 'jpeg', 'png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MIME_TYPES: Record<SupportedFileType, string[]> = {
  pdf: ['application/pdf'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ],
  jpeg: ['image/jpeg', 'image/jpg'],
  png: ['image/png']
};

export const validateFile = (file: File): FileValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File size exceeds 10MB limit'
    };
  }

  const fileType = getFileType(file);
  if (!fileType) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload PDF, DOCX, JPEG, or PNG files'
    };
  }

  return {
    isValid: true,
    fileType
  };
};

const getFileType = (file: File): SupportedFileType | null => {
  for (const [type, mimes] of Object.entries(MIME_TYPES)) {
    if (mimes.includes(file.type)) {
      return type as SupportedFileType;
    }
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension && SUPPORTED_TYPES.includes(extension as SupportedFileType)) {
    return extension as SupportedFileType;
  }

  return null;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};