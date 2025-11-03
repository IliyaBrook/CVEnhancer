import type { AIProvider } from '@/types';

/**
 * List of known Vision Language model patterns
 */
const VL_MODEL_PATTERNS = [
  // Ollama VL models
  'llava',
  'bakllava',
  'llava-llama3',
  'llava-phi3',
  'moondream',
  'cogvlm',
  'qwen-vl',
  'qwen2-vl',
  'qwen3-vl',
  'minicpm-v',
  'internvl',

  // OpenAI VL models
  'gpt-4-vision',
  'gpt-4o',
  'gpt-4-turbo',

  // Claude VL models (all Claude 3 models support vision)
  'claude-3',

  // Generic patterns
  'vision',
  '-vl',
  '_vl',
];

/**
 * Check if a model supports vision/image input based on model name
 * @param modelName The model name to check
 * @param provider The AI provider (optional, for future use)
 * @returns true if the model supports vision
 */
export const isVisionModel = (modelName: string | undefined, _provider?: AIProvider): boolean => {
  if (!modelName) {
    return false;
  }

  const lowerModelName = modelName.toLowerCase();

  // Check against known VL patterns
  return VL_MODEL_PATTERNS.some(pattern =>
    lowerModelName.includes(pattern.toLowerCase())
  );
};

/**
 * Get recommended scale for PDF to image conversion based on model
 * @param modelName The model name
 * @returns Recommended scale factor
 */
export const getRecommendedScale = (modelName: string | undefined): number => {
  if (!modelName) {
    return 2.0; // High quality by default
  }

  const lowerModelName = modelName.toLowerCase();

  // Smaller models might benefit from lower resolution to reduce token usage
  if (lowerModelName.includes('mini') || lowerModelName.includes('7b')) {
    return 1.5;
  }

  // Large models can handle high resolution
  if (lowerModelName.includes('70b') || lowerModelName.includes('large')) {
    return 2.5;
  }

  return 2.0; // Default high quality
};

/**
 * Get maximum number of pages to process based on model
 * @param modelName The model name
 * @returns Maximum number of pages
 */
export const getMaxPages = (modelName: string | undefined): number => {
  if (!modelName) {
    return 3; // Default: first 3 pages
  }

  const lowerModelName = modelName.toLowerCase();

  // Smaller models - limit to 2 pages to avoid overwhelming context
  if (lowerModelName.includes('mini') || lowerModelName.includes('7b')) {
    return 2;
  }

  // Medium models - 3 pages
  if (lowerModelName.includes('8b') || lowerModelName.includes('13b')) {
    return 3;
  }

  // Large models - can handle more pages
  return 4;
};
