import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('The Wedding Dreams ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-[#F8F5EF]">
          <div className="max-w-md w-full p-8 bg-white border border-[#EAE5DC] rounded-[8px] text-center shadow-md space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F2] border border-[#BA1A1A]/20 text-[#BA1A1A] flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-[22px] text-[#171717] font-normal">
              An Unexpected Glitch Occurred
            </h3>
            <p className="text-[13px] text-[#77736D] leading-relaxed">
              We apologize for the disruption in your curatorial experience. Our directorship has been notified.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={this.handleReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reload Atelier
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
