import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IArticle, IArticleListResponse, IComment } from '../types/article';
import type { RootState } from '../app/store';
import { setSessionExpired } from '../store/slices/sessionSlice'; 


export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: async (args, api, extraOptions) => {
    const base = fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/api/`,
        credentials: 'include', // Include credentials for cookies
        prepareHeaders: (headers, { getState }) => {
          const csrfToken = (getState() as RootState).csrf.csrfToken;
          if (csrfToken) {
            headers.set('X-CSRF-Token', csrfToken); // Add CSRF token if available
          }
          return headers;
        },
      });

    const result = await base(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Unauthorized, set session as expired
      api.dispatch(setSessionExpired(true));
    }

    return result;
  },
  tagTypes: ['Articles', 'Article'],
  endpoints: (builder) => ({
    // Public endpoints
    listArticles: builder.query<
      IArticleListResponse,
      { search?: string; tags?: string[]; page?: number; limit?: number; status?: string[]; authorId?: string }
    >({
      query: ({ search, tags, page = 1, limit = 10, status, authorId }) => ({
        url: 'articles',
        params: {
          search,
          tags: tags?.join(','),
          page,
          limit,
          status: status?.join(','),
          authorId,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Article' as const, id: _id })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
    }),

    listArticlesAdmin: builder.query<
    IArticleListResponse,
    { search?: string; tags?: string[]; page?: number; limit?: number; status?: string[]; authorId?: string }
  >({
    query: ({ search, tags, page = 1, limit = 10, status, authorId }) => ({
      url: 'articles/admin',
      params: {
        search,
        tags: tags?.join(','),
        page,
        limit,
        status: status?.join(','),
        authorId,
      },
    }),
    providesTags: (result) =>
      result
        ? [
            ...result.data.map(({ _id }) => ({ type: 'Article' as const, id: _id })),
            { type: 'Articles', id: 'LIST' },
          ]
        : [{ type: 'Articles', id: 'LIST' }],
  }),

    getRelatedArticles: builder.query<IArticle[], string>({
      query: (id) => `articles/${id}/related`,
      transformResponse: (response: { data: IArticle[] }) => response.data,
    }),

    updateArticleStatus: builder.mutation<IArticle, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `articles/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
    }),
    getArticle: builder.query<IArticle, string>({
      query: (slug) => `articles/${slug}`,
      transformResponse: (response: { data: IArticle }) => response.data,
      providesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),
    getArticleById: builder.query<IArticle, string>({
      query: (id) => `articles/id/${id}`, // Updated the URL
      transformResponse: (response: { data: IArticle }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Article', id }],
    }),
    // Protected endpoints
    createArticle: builder.mutation<IArticle, Partial<IArticle>>({
      query: (body) => ({
        url: 'articles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    updateArticle: builder.mutation<IArticle, { id: string; data: Partial<IArticle> }>({
      query: ({ id, data }) => ({
        url: `articles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
    }),
    getTrendingArticles: builder.query<IArticle[], number | void>({
      query: (limit = 5) => ({
        url: 'articles/trending',
        params: { limit },
      }),
      transformResponse: (response: { data: IArticle[] }) => response.data,
    }),
    deleteArticle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    likeArticle: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `articles/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Article', id }],
    }),
    addComment: builder.mutation<IArticle, { id: string; content: string }>({
      query: ({ id, content }) => ({
        url: `articles/${id}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Article', id }],
    }),
  }),
});

export const {
  useListArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useAddCommentMutation,
  useUpdateArticleStatusMutation,
  useListArticlesAdminQuery,
  useGetRelatedArticlesQuery,
  useGetTrendingArticlesQuery,
  useGetArticleByIdQuery,
} = articleApi;
