export enum AIProvider {
	OPENAI = 'openai',
	CHATGPT = 'chatgpt',
	CLAUDE = 'claude',
	OLLAMA = 'ollama',
}

export interface AIConfig {
	model?: string,
	provider: AIProvider
	apiKey?: string
	ollamaEndpoint?: string
}