export interface OpenAIOptions {
	// Sampling parameters
	temperature?: number; // 0-2, default: 1
	top_p?: number; // 0-1, default: 1
	// Token control 
	max_tokens?: number; // or max_completion_tokens
	stop?: string | string[]; // up to 4 sequences
	// Penalty parameters
	presence_penalty?: number; // -2.0 to 2.0, default: 0
	frequency_penalty?: number; // -2.0 to 2.0, default: 0
	// Advanced parameters
	logit_bias?: Record<string, number>; // token_id: bias (-100 to 100)
	seed?: number; // for determinism (beta)
	logprobs?: boolean; // whether to return log probabilities
	top_logprobs?: number; // 0-20, how many top tokens to show
	// Response control
	n?: number; // number of response variants
	stream?: boolean;
	response_format?: { type: "text" | "json_object" | "json_schema" };
	// Other
	user?: string; // user identifier
}

export interface OllamaOptions {
	temperature?: number; // default: 0.8
	top_p?: number; // default: 0.9
	top_k?: number; // default: 40
	min_p?: number; // minimum probability threshold
	
	// Token control
	num_predict?: number; // max tokens to generate, default: -1 (infinite)
	num_ctx?: number; // context window size, default: 4096
	stop?: string[]; // stop sequences
	
	// Repetition control
	repeat_penalty?: number; // default: 1.1
	repeat_last_n?: number; // default: 64
	presence_penalty?: number;
	frequency_penalty?: number;
	
	// Advanced sampling
	mirostat?: number; // 0, 1, or 2 (0 = disabled)
	mirostat_eta?: number; // learning rate, default: 0.1
	mirostat_tau?: number; // target entropy, default: 5.0
	tfs_z?: number; // tail free sampling
	
	// Other
	seed?: number; // random seed for reproducibility
}


export interface ClaudeOptions {
	// Sampling parameters - NO separate options object!
	temperature?: number; // 0-1, default: 1
	top_p?: number; // 0-1
	top_k?: number; // for removing low probability responses
	
	// Token control
	max_tokens: number; // REQUIRED! Maximum tokens to generate
	stop_sequences?: string[]; // custom stop sequences
	
	// Response control
	stream?: boolean;
	
	// System and metadata
	system?: string; // system prompt
	metadata?: {
		user_id?: string;
		[key: string]: any;
	};
	
	// Extended thinking (for Claude 3.5+)
	thinking?: {
		type: "enabled" | "disabled";
		budget_tokens?: number; // minimum 1024
	};
}