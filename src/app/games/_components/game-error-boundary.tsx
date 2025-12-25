'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('Game error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="bg-white border-4 border-red-500 p-8 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-md">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-black mb-2 uppercase italic text-red-600">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6 font-medium">
              {this.state.error?.message ??
                'An unexpected error occurred. Please refresh the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
            >
              REFRESH PAGE
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { GameErrorBoundary };