import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string; // Store the specific error message
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Customize the fallback state with specific error messages
    let errorMessage = 'An unexpected error has occurred.';

    if (error.message.includes('401')) {
      errorMessage = 'You are not authorized. Please log in again.';
    } else if (error.message.includes('404')) {
      errorMessage = 'The requested resource could not be found.';
    } else if (error.message.includes('500')) {
      errorMessage = 'A server error occurred. Please try again later.';
    }

    return { hasError: true, errorMessage };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Optional: Log errors to an external monitoring service
    // e.g., Sentry.captureException(error);
  }

  render() {
    const { hasError, errorMessage } = this.state;

    if (hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
          <h1 className="text-4xl font-bold text-red-600">Something went wrong.</h1>
          <p className="mt-4 text-lg text-red-500 text-center">{errorMessage}</p>
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
