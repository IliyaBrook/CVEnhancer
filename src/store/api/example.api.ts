import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Example types for API requests and responses
export interface ExampleItem {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in-progress';
  createdAt: string;
}

export interface ExampleRequestType {
  title: string;
  description: string;
}

export interface ExampleResponseType {
  success: boolean;
  data: ExampleItem;
  message?: string;
}

export interface ExampleGetResponseType {
  success: boolean;
  data: ExampleItem[];
  total: number;
}

export interface ExamplePostResponseType {
  success: boolean;
  data: ExampleItem;
  message?: string;
}

export interface ExampleUpdateRequest {
  id: number;
  title?: string;
  description?: string;
  status?: 'pending' | 'completed' | 'in-progress';
}

export const exampleApi = createApi({
  reducerPath: 'exampleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    prepareHeaders: headers => {
      // Example: Add auth token if available
      // const token = (getState() as RootState).auth.token;
      // if (token) {
      //   headers.set('authorization', `Bearer ${token}`);
      // }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['ExampleItem'],
  endpoints: builder => ({
    // Get all example items
    getExampleItems: builder.query<ExampleGetResponseType, void>({
      query: () => ({
        url: 'examples',
        method: 'GET',
      }),
      providesTags: ['ExampleItem'],
    }),

    // Get single example item by ID
    getExampleItem: builder.query<ExampleResponseType, number>({
      query: id => ({
        url: `examples/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'ExampleItem', id }],
    }),

    // Create new example item
    createExampleItem: builder.mutation<
      ExampleResponseType,
      ExampleRequestType
    >({
      query: body => ({
        url: 'examples',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ExampleItem'],
    }),

    // Update example item
    updateExampleItem: builder.mutation<
      ExamplePostResponseType,
      ExampleUpdateRequest
    >({
      query: ({ id, ...body }) => ({
        url: `examples/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'ExampleItem', id }],
    }),

    // Delete example item
    deleteExampleItem: builder.mutation<{ success: boolean }, number>({
      query: id => ({
        url: `examples/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [{ type: 'ExampleItem', id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetExampleItemsQuery,
  useGetExampleItemQuery,
  useCreateExampleItemMutation,
  useUpdateExampleItemMutation,
  useDeleteExampleItemMutation,
} = exampleApi;
