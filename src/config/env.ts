const getEnvString = (key: string, defaultValue?: string): string => {
	const value = import.meta.env[key] ?? defaultValue
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`)
	}
	return value
}

const getEnvNumber = (key: string, defaultValue: number): number => {
	const value = import.meta.env[key]
	if (!value) return defaultValue
	
	const parsed = Number(value)
	if (isNaN(parsed)) {
		throw new Error(`${key} must be a valid number, got: ${value}`)
	}
	return parsed
}

export const topOp = getEnvNumber('VITE_TOP_OP', 0.9)
export const temperature = getEnvNumber('VITE_TEMPERATURE', 0.9)
export const maxTokens = getEnvNumber('VITE_MAX_TOKENS', 0.9)
export const stopGeneration = getEnvString('STOP_GENERATION', '"}\\n\\n", "\\n\\n\\n"')