import { ClaudeOptions, OpenAIOptions, OllamaOptions } from '@/types';

// @ts-ignore
const getEnvString = (key: string, defaultValue?: string = ''): string => {
	const value = import.meta.env[key] ?? defaultValue
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

// @ts-ignore
const getEnvBoolean = (key: string, defaultValue: boolean = false): boolean => {
	const value = import.meta.env[key]
	if (!value) return defaultValue
	
	if (value === 'true') return true
	if (value === 'false') return false
	
	throw new Error(`${key} must be 'true' or 'false', got: ${value}`)
}

const getEnvNumber = (key: string, defaultValue: number = 0): number => {
	const value = import.meta.env[key]
	if (!value) return defaultValue
	
	const parsed = Number(value)
	if (isNaN(parsed)) {
		throw new Error(`${key} must be a valid number, got: ${value}`)
	}
	return parsed
}

const stopOption: string[] = [
	"}\n\n",
	"\n\nHuman:",
	"\n\n\n"
]

export const debug = getEnvBoolean('VITE_DEBUG', false)

// OPEN AI
export const openaiOptions: OpenAIOptions = {
	temperature: getEnvNumber('VITE_OPENAI_TEMPERATURE'),
	top_p: getEnvNumber('VITE_OPENAI_TOP_P'),
	max_tokens: getEnvNumber('VITE_OPENAI_MAX_TOKENS'),
	frequency_penalty: getEnvNumber('VITE_OPENAI_FREQUENCY_PENALTY'),
	presence_penalty: getEnvNumber('VITE_OPENAI_PRESENCE_PENALTY'),
	stop: stopOption
}
// CLAUDE
export const claudeOptions: ClaudeOptions = {
	temperature: getEnvNumber('VITE_CLAUDE_TEMPERATURE'),
	max_tokens: getEnvNumber('VITE_CLAUDE_MAX_TOKENS'),
	top_p: getEnvNumber('VITE_CLAUDE_TOP_P'),
	top_k: getEnvNumber('VITE_CLAUDE_TOP_K'),
	stop_sequences: stopOption
}
// OLLAMA
export const ollamaOptions: OllamaOptions = {
	temperature: getEnvNumber('VITE_OLLAMA_TEMPERATURE'),
	top_p: getEnvNumber('VITE_OLLAMA_TOP_OP'),
	top_k: getEnvNumber('VITE_OLLAMA_TOP_K'),
	num_predict: getEnvNumber('VITE_OLLAMA_MAX_TOKENS'),
	repeat_penalty: getEnvNumber('VITE_OLLAMA_REPEAT_PENALTY'),
	presence_penalty: getEnvNumber('VITE_OLLAMA_PRESENCE_PENALTY'),
	stop: stopOption
}
