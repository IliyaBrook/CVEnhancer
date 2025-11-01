export enum AIProvider {
	OPENAI = 'openai',
	CHATGPT = 'chatgpt',
	CLAUDE = 'claude',
	OLLAMA = 'ollama',
}

export interface AIConfig {
	provider: AIProvider
	apiKey?: string
	ollamaEndpoint?: string
	model?: string
}