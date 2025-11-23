import {createApi, fetchBaseQuery, retry} from '@reduxjs/toolkit/query/react';
import {REHYDRATE} from 'redux-persist';
import type {Action} from '@reduxjs/toolkit';
import type {ClaudeApiBody, OllamaApiBody, OpenAIApiBody} from '@/types/api.body';
import type {ResumeData} from '@/types';

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
	key: string;
	payload: any;
	err: unknown;
} {
	return action.type === REHYDRATE;
}

interface OpenAIRequest {
	body: OpenAIApiBody;
	apiKey: string;
}

interface ClaudeRequest {
	body: ClaudeApiBody;
	apiKey: string;
}

interface OllamaRequest {
	body: OllamaApiBody;
	endpoint: string;
}

interface OpenAIResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}

interface ClaudeResponse {
	content: Array<{
		text: string;
	}>;
}

interface OllamaResponse {
	response?: string;
	thinking?: string;
	message?: string;
	content?: string;
}

interface OllamaModelsResponse {
	models: Array<{
		name: string;
		model: string;
		modified_at: string;
		size: number;
	}>;
}

const staggeredBaseQuery = retry(
	fetchBaseQuery({
		prepareHeaders: (headers) => {
			headers.set('Content-Type', 'application/json');
			return headers;
		},
	}),
	{
		maxRetries: 3,
	}
);

export const aiApi = createApi({
	reducerPath: 'aiApi',
	baseQuery: staggeredBaseQuery,
	tagTypes: ['AI'],
	extractRehydrationInfo(action, {reducerPath}): any {
		if (isHydrateAction(action)) {
			return action.payload?.[reducerPath];
		}
	},
	endpoints: (builder) => ({
		enhanceWithOpenAI: builder.mutation<ResumeData, OpenAIRequest>({
			query: ({body, apiKey}) => ({
				url: '/api/openai/v1/chat/completions',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
				},
				body,
			}),
			transformResponse: (response: OpenAIResponse): ResumeData => {
				const content = response.choices[0].message.content;
				return JSON.parse(content);
			},
		}),
		
		enhanceWithClaude: builder.mutation<ResumeData, ClaudeRequest>({
			query: ({body, apiKey}) => ({
				url: '/api/anthropic/v1/messages',
				method: 'POST',
				headers: {
					'x-api-key': apiKey,
					'anthropic-version': '2023-06-01',
					'anthropic-dangerous-direct-browser-access': 'true',
				},
				body,
			}),
			transformResponse: (response: ClaudeResponse): ResumeData => {
				const contentText = '{' + response.content[0].text;
				return JSON.parse(contentText);
			},
		}),
		
		generateWithOllama: builder.mutation<OllamaResponse, OllamaRequest>({
			query: ({body, endpoint}) => ({
				url: `${endpoint}/api/generate`,
				method: 'POST',
				body,
			}),
		}),
		
		fetchOllamaModels: builder.query<OllamaModelsResponse, string>({
			query: (endpoint) => ({
				url: `${endpoint}/api/tags`,
				method: 'GET',
			}),
		}),
	}),
});

export const {
	useEnhanceWithOpenAIMutation,
	useEnhanceWithClaudeMutation,
	useGenerateWithOllamaMutation,
	useFetchOllamaModelsQuery,
} = aiApi;