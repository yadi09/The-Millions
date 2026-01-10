import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
    endpoints: (builder) => ({
        getPage: builder.query<any, string>({
            query: (slug) => `/pages/${slug}`,
        }),
    }),
});

export const { useGetPageQuery } = apiSlice;
