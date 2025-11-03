export interface OpenAIOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stop?: string | string[];
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  seed?: number;
  logprobs?: boolean;
  top_logprobs?: number;
  n?: number;
  stream?: boolean;
  response_format?:
    | { type: 'text' | 'json_object' }
    | {
        type: 'json_schema';
        json_schema: {
          name: string;
          strict?: boolean;
          schema: Record<string, any>;
        };
      };
  user?: string;
}

export interface OllamaOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  min_p?: number;
  num_predict?: number;
  num_ctx?: number;
  stop?: string[];
  repeat_penalty?: number;
  repeat_last_n?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  mirostat?: number;
  mirostat_eta?: number;
  mirostat_tau?: number;
  tfs_z?: number;
  seed?: number;
}

export interface ClaudeOptions {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens: number;
  stop_sequences?: string[];
  stream?: boolean;
  system?: string;
  metadata?: {
    user_id?: string;
    [key: string]: any;
  };
  thinking?: {
    type: 'enabled' | 'disabled';
    budget_tokens?: number;
  };
}
