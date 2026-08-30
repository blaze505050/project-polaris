import React, { Component, ReactNode, ReactElement } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-screen flex items-center justify-center bg-aerospace-dark">
            <div className="text-center max-w-md px-6">
              <AlertCircle className="w-16 h-16 text-aerospace-danger mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
              <p className="text-foreground/70 mb-6 text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 bg-aerospace-blue/30 hover:bg-aerospace-blue/50 rounded text-foreground font-semibold transition-all flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-4 py-2 bg-aerospace-accent/30 hover:bg-aerospace-accent/50 rounded text-foreground font-semibold transition-all"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
