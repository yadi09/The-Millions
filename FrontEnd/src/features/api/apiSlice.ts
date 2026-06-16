import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getToken, clearAuth } from '../../utils/authUtils';
import type { Page, UpdatePageRequest } from '../../types';
import { type Testimonial, type SubmitTestimonialRequest, type TestimonialStatus } from '../../types/testimonial';
import type { Service } from '../../types/service';
import type { ContactMessage, GetContactMessagesResponse, ContactStatus, ContactSource } from '../../types/contact';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Wraps the base fetch. Any 401 response (expired / invalid / missing token
// on a protected endpoint) clears local auth and bounces to the login page.
// We use window.location instead of react-router here because baseQuery runs
// outside the React tree.
const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    clearAuth();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Page', 'BlogPost', 'BlogCategory', 'Testimonial', 'Service', 'Footer', 'ContactMessage', 'BusinessCard', 'SocialPost'],
  baseQuery: baseQueryWithAuth,
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

    // --- BLOG ENDPOINTS ---
    getBlogPosts: builder.query<any[], void>({
      query: () => '/admin/blogs',
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.blogs) return response.blogs;
        if (response?.posts) return response.posts;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }: any) => ({ type: 'BlogPost' as const, id })),
            { type: 'BlogPost', id: 'LIST' },
          ]
          : [{ type: 'BlogPost', id: 'LIST' }],
    }),

    getBlogPost: builder.query<any, string>({
      query: (id) => `/admin/blogs/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'BlogPost', id }],
    }),

    createBlogPost: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: '/admin/blogs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
    }),

    updateBlogPost: builder.mutation<any, { id: string; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/admin/blogs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'BlogPost', id },
        { type: 'BlogPost', id: 'LIST' },
      ],
    }),

    deleteBlogPost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'BlogPost', id: 'LIST' }],
    }),

    getBlogCategories: builder.query<string[], void>({
      query: () => '/blogs/categories',
      providesTags: ['BlogCategory'],
    }),

    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/admin/upload',
        method: 'POST',
        body: formData,
      }),
    }),

    // --- PUBLIC BLOG ENDPOINTS ---
    getPublicBlogPosts: builder.query<{ blogs: any[]; pagination: any }, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => `/blogs?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
            ...result.blogs.map(({ id }: any) => ({ type: 'BlogPost' as const, id })),
            { type: 'BlogPost', id: 'LIST' },
          ]
          : [{ type: 'BlogPost', id: 'LIST' }],
    }),

    getPublicBlogPost: builder.query<any, string>({
      query: (slug) => `/blogs/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'BlogPost', id: slug }],
    }),

    // --- TESTIMONIAL ENDPOINTS (Mocked) ---
    getTestimonials: builder.query<Testimonial[], { role: 'admin' | 'public' }>({
      query: ({ role }) => (role === 'admin' ? '/admin/testimonials' : '/testimonials'),
      providesTags: ['Testimonial'],
    }),

    submitTestimonial: builder.mutation<Testimonial, SubmitTestimonialRequest>({
      query: (data) => ({
        url: '/testimonials',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    updateTestimonialStatus: builder.mutation<Testimonial, { id: string, status: TestimonialStatus, order: number }>({
      query: ({ id, ...data }) => ({
        url: `/admin/testimonials/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Testimonial'],
    }),

    deleteTestimonial: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/testimonials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Testimonial'],
    }),

    // --- SERVICE ENDPOINTS ---
    getServices: builder.query<Service[], void>({
      query: () => '/services',
      providesTags: ['Service'],
    }),
    createService: builder.mutation<Service, Omit<Service, 'id'>>({
      query: (newService) => ({
        url: '/services',
        method: 'POST',
        body: newService,
      }),
      invalidatesTags: ['Service'],
    }),
    updateService: builder.mutation<Service, Service>({
      query: ({ id, ...rest }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Service'],
    }),
    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Service'],
    }),

    // --- CONTACT FORM ENDPOINTS ---
    getContactServices: builder.query<any[], void>({
      query: () => '/services',
      providesTags: ['Service'],
    }),

    submitContact: builder.mutation<any, { fullName: string; email: string; phone?: string; message: string; serviceId: string }>({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),

    // --- ADMIN CONTACT MESSAGES ENDPOINTS ---
    getContactMessages: builder.query<GetContactMessagesResponse, { page?: number; limit?: number; status?: ContactStatus; source?: ContactSource; search?: string }>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.status) query.append('status', params.status);
        if (params.source) query.append('source', params.source);
        if (params.search) query.append('search', params.search);

        return `/admin/contact-messages?${query.toString()}`;
      },
      providesTags: ['ContactMessage'],
    }),

    updateContactMessageStatus: builder.mutation<ContactMessage, { id: string; status: ContactStatus }>({
      query: ({ id, status }) => ({
        url: `/admin/contact-messages/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['ContactMessage'],
    }),

    deleteContactMessage: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({
        url: `/admin/contact-messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContactMessage'],
    }),
    
    // --- FOOTER ENDPOINTS ---
    getFooter: builder.query<any, void>({
      query: () => '/footer',
      providesTags: ['Footer'],
    }),
    
    updateFooter: builder.mutation<any, any>({
      query: (data) => ({
        url: '/footer',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Footer'],
    }),

    // Business card — one per authenticated user. 204 = no card yet.
    getMyBusinessCard: builder.query<any | null, void>({
      query: () => ({ url: '/business-card/me', responseHandler: async (r) => (r.status === 204 ? null : r.json()) }),
      providesTags: ['BusinessCard'],
    }),
    upsertMyBusinessCard: builder.mutation<any, any>({
      query: (data) => ({ url: '/business-card/me', method: 'PUT', body: data }),
      invalidatesTags: ['BusinessCard'],
    }),

    // Social posts — per-user draft library
    getMySocialPosts: builder.query<any[], void>({
      query: () => '/social-posts',
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: 'SocialPost' as const, id: p.id })), { type: 'SocialPost' as const, id: 'LIST' }]
          : [{ type: 'SocialPost' as const, id: 'LIST' }],
    }),
    upsertSocialPost: builder.mutation<any, any>({
      query: (data) => ({ url: '/social-posts', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'SocialPost' as const, id: 'LIST' }],
    }),
    deleteSocialPost: builder.mutation<{ id: string; deleted: boolean }, string>({
      query: (id) => ({ url: `/social-posts/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'SocialPost' as const, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetPageQuery,
  useUpdatePageMutation,
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetBlogCategoriesQuery,
  useUploadImageMutation,
  useGetPublicBlogPostsQuery,
  useGetPublicBlogPostQuery,
  useGetTestimonialsQuery,
  useSubmitTestimonialMutation,
  useUpdateTestimonialStatusMutation,
  useDeleteTestimonialMutation,
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetContactServicesQuery,
  useSubmitContactMutation,
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
  useGetFooterQuery,
  useUpdateFooterMutation,
  useGetMyBusinessCardQuery,
  useUpsertMyBusinessCardMutation,
  useGetMySocialPostsQuery,
  useUpsertSocialPostMutation,
  useDeleteSocialPostMutation,
} = apiSlice;