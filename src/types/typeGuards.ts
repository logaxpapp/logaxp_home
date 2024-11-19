// src/types/typeGuards.ts

import { FetchBaseQueryError, SerializedError } from '@reduxjs/toolkit';

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error
  );
};

export const isSerializedError = (
  error: unknown
): error is SerializedError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  );
};
