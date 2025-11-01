const getEnvVar = (key: string, defaultValue?: string): string => {
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

export const envKey = getEnvVar('VITE_ENCRYPTION_KEY', '')
export const topOp = getEnvNumber('TOP_OP', 0.9)
export const temperature = getEnvNumber('TEMPERATURE', 0.9)