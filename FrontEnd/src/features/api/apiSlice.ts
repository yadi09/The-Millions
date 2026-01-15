import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getToken } from '../../utils/authUtils';
import type { Page, UpdatePageRequest } from '../../types';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Page'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = getToken();
      // If token exists, attach Authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPage: builder.query<Page, string>({
      query: (slug) => `/pages/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Page', id: slug }],
    }),

    updatePage: builder.mutation<Page, UpdatePageRequest>({
      query: ({ id, data }) => ({
        url: `/admin/pages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result) => result
        ? [{ type: 'Page', id: result.slug }, { type: 'Page', id: 'home' }]
        : ['Page'],
    }),
  }),
});

export const { useGetPageQuery, useUpdatePageMutation } = apiSlice;