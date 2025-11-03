export enum AIProvider {
	OPENAI = 'openai',
	CLAUDE = 'claude',
	OLLAMA = 'ollama',
}

export interface AIConfig {
	provider: AIProvider
	apiKeys?: {
		openai?: string;
		claude?: string;
	}
	models?: {
		openai?: string;
		claude?: string;
		ollama?: string;
	}
	ollamaEndpoint?: string
}