export interface ParsedResumeData {
  text?: string;
  isVisionMode?: boolean;
  dataURLs?: string[];
  images?: string[];
}

export interface EnhanceResumeRequest {
  parsedData: ParsedResumeData;
  provider: string;
  apiKey?: string;
  model?: string;
  endpoint?: string;
  jobTitle?: string;
}

export interface AIApiResponse<T = any> {
  data: T;
  error?: string;
}

export interface RetryConfig {
  maxRetries?: number;
  backoffMs?: number;
}