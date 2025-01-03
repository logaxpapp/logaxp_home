// src/api/documentApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery'; // Reuse your custom baseQuery
import { RootState } from '../app/store';

/** DocumentVisibility from your model */
export type DocumentVisibility = 'PUBLIC' | 'PRIVATE';

/** Minimal type for watchers (e.g., user references) */
export interface IUserRef {
  _id: string;
  name?: string;
  email?: string;
}

/** Document interface matching your backend */
export interface IDocument {
  _id: string;
  title: string;
  description?: string;
  url: string;                   // S3 public URL
  key: string;                   // S3 key
  visibility: DocumentVisibility;
  watchers: IUserRef[];
  createdAt: string;
  updatedAt: string;
  passwordProtected: boolean;
  encryptionKey?: string;
  recipientUser?: string;   // userId
  recipientEmail?: string;
  sentBy?: string; 
  tags: string[];
  category: string;
}

/** Response shape for getAllDocuments */
interface GetAllDocumentsResponse {
  documents: IDocument[];
  total: number;
}

/** Create the documentApi slice */
export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: customBaseQuery, // or fetchBaseQuery({ baseUrl: ... })
  tagTypes: ['Document'],
  endpoints: (builder) => ({

      /**
     * Create Protected Document
     * Accepts formData with `recipientUserId` or `recipientEmail`.
     */
      createProtectedDocument: builder.mutation<IDocument, FormData>({
        query: (formData) => ({
          url: '/documents/protected',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Document', id: 'LIST' }],
      }),
  
      /**
       * Retrieve sent documents
       * e.g. filter=toMe or filter=byMe
       */
      fetchSentDocuments: builder.query<IDocument[], { filter: 'toMe' | 'byMe' }>({
        query: ({ filter }) => `/documents/sent?filter=${filter}`,
        providesTags: [{ type: 'Document', id: 'LIST' }],
      }),
  
      /**
       * Download Protected Document
       */
      downloadProtectedDocument: builder.mutation<
        { doc: IDocument; presignedUrl: string },
        { docId: string; password: string }
      >({
        query: ({ docId, password }) => ({
          url: `/documents/protected/${docId}/download`,
          method: 'POST',
          body: { password },
        }),
      }),
    /**
     * Upload Document (multipart/form-data)
     * Requires a FormData body with fields: title, description, visibility, attachment
     */
    uploadDocument: builder.mutation<IDocument, FormData>({
      query: (formData) => ({
        url: '/documents',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    /**
     * Fetch all documents (with optional pagination & visibility filtering)
     */
    fetchAllDocuments: builder.query<
      GetAllDocumentsResponse,
      { skip?: number; limit?: number; visibility?: DocumentVisibility; category?: string }
    >({
      query: ({ skip = 0, limit = 10, visibility, category }) => {
        let queryString = `/documents?skip=${skip}&limit=${limit}`;
        if (visibility) queryString += `&visibility=${visibility}`;
        if (category) queryString += `&category=${category}`;
        return queryString;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.documents.map((doc) => ({ type: 'Document' as const, id: doc._id })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    /**
     * Get a single document by ID
     */
    getDocumentById: builder.query<IDocument, string>({
      query: (docId) => `/documents/${docId}`,
      providesTags: (result, error, docId) => [{ type: 'Document', id: docId }],
    }),

    /**
     * Update document
     */
    updateDocument: builder.mutation<
      IDocument,
      { docId: string; data: Partial<Pick<IDocument, 'title' | 'description' | 'visibility'>> }
    >({
      query: ({ docId, data }) => ({
        url: `/documents/${docId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { docId }) => [{ type: 'Document', id: docId }],
    }),

    /**
     * Delete document (removes from MongoDB; optionally from S3 if your backend code does that)
     */
    deleteDocument: builder.mutation<{ message: string }, string>({
      query: (docId) => ({
        url: `/documents/${docId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    /**
     * Delete from S3 Bucket specifically (if you have a separate endpoint)
     */
    deleteDocuments3Bucket: builder.mutation<{ message: string }, string>({
      query: (docId) => ({
        url: `/documents/s3/${docId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Document', id: 'LIST' }],
    }),

    /**
     * Add watcher to a PRIVATE document
     */
    addWatcher: builder.mutation<
      IDocument,
      { docId: string; userId: string }
    >({
      query: ({ docId, userId }) => ({
        url: `/documents/${docId}/watchers`,
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: (result, error, { docId }) => [{ type: 'Document', id: docId }],
    }),

    /**
     * Remove watcher from a document
     */
    removeWatcher: builder.mutation<
      IDocument,
      { docId: string; userId: string }
    >({
      query: ({ docId, userId }) => ({
        url: `/documents/${docId}/watchers/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { docId }) => [{ type: 'Document', id: docId }],
    }),

    // Add tags 
    addTagToDocument: builder.mutation<IDocument, { docId: string; tag: string }>({
        query: ({ docId, tag }) => ({
          url: `/documents/${docId}/tags`,
          method: 'POST',
          body: { tag },
        }),
        invalidatesTags: (result, error, { docId }) => [{ type: 'Document', id: docId }],
      }),
      removeTagFromDocument: builder.mutation<IDocument, { docId: string; tag: string }>({
        query: ({ docId, tag }) => ({
          url: `/documents/${docId}/tags`,
          method: 'DELETE',
          body: { tag },
        }),
        invalidatesTags: (result, error, { docId }) => [{ type: 'Document', id: docId }],
      }),
  }),
});

export const {
  useUploadDocumentMutation,
  useFetchAllDocumentsQuery,
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useDeleteDocuments3BucketMutation,
  useAddWatcherMutation,
  useRemoveWatcherMutation,
  useCreateProtectedDocumentMutation,
  useDownloadProtectedDocumentMutation,
  useFetchSentDocumentsQuery,
  useAddTagToDocumentMutation,
  useRemoveTagFromDocumentMutation,
} = documentApi;
