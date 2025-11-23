import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const fetchOllamaModelsApi = createApi({
	baseQuery: fetchBaseQuery({
		baseUrl: '/',
		prepareHeaders: (headers) => {
			headers.set('Content-Type', 'application/json');
			return headers;
		},
	}),
	tagTypes: ['Ai'],
	// endpoints: builder => ({
	// 	fetchOllamaModels: (ollamaEndpoint: string) => ollamaEndpoint + '/api/tags'
	// })
	endpoints: build.query({})
})