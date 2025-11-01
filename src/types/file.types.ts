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