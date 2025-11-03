export type ProcessingStatus =
	| 'idle'
	| 'uploading'
	| 'parsing'
	| 'enhancing'
	| 'completed'
	| 'error'

export type SupportedFileType = 'pdf' | 'docx' | 'jpeg' | 'png'

export interface FileValidationResult {
	isValid: boolean
	error?: string
	errorMessage?: string
	fileType?: SupportedFileType
}

export interface ParsedResumeData {
	text?: string // Text content for non-VL models
	images?: string[] // Base64 images for VL models (without data URL prefix)
	dataURLs?: string[] // Full data URLs for OpenAI/Claude
	isVisionMode: boolean // Whether vision mode is being used
}