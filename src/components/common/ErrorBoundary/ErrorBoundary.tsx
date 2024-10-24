// src/components/common/ErrorBoundary/ErrorBoundary.tsx

import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state to display fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('Uncaught error:', error, errorInfo);
    // Optional: Send error details to an external logging service
    // e.g., Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI with Tailwind CSS styling
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
          <h1 className="text-4xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-4 text-lg text-red-500 text-center">
            An unexpected error has occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
