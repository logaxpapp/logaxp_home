// src/features/Toast/globalToast.ts

type ToastCallback = (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;

let globalToast: ToastCallback | null = null;

/**
 * Registers a global toast function (the one from `useToast`).
 */
export function registerGlobalToast(toastFn: ToastCallback) {
  globalToast = toastFn;
}

/**
 * Allows calling `globalToast(...)` from anywhere, e.g. in your baseQuery.
 */
export function showGlobalToast(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
  if (globalToast) {
    globalToast(message, type, duration);
  } else {
    console.warn('No global toast registered!');
  }
}
