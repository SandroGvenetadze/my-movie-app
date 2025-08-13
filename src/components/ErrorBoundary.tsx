// src/components/ErrorBoundary.tsx
// Purpose: Catch React render errors and display a friendly fallback.
import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-300">
          <h2 className="text-xl mb-2">Something went wrong.</h2>
          <pre className="text-sm whitespace-pre-wrap opacity-80">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
