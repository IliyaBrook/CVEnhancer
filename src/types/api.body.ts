import type { ClaudeOptions, OllamaOptions, OpenAIOptions } from './api.options'

interface StandardAIApiBody {
	model: string,
	messages: Array<Record<string, any>>
}

export interface OpenAIApiBody extends OpenAIOptions, StandardAIApiBody {}

export interface ClaudeApiBody extends ClaudeOptions, StandardAIApiBody {}

export interface OllamaApiBody {
	model: string,
	prompt: string,
	stream?: boolean,
	format?: string,
	options?: OllamaOptions
}