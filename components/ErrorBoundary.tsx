import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-château-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-château-night/90 border border-château-border rounded-sm p-8 text-center">
            <h2 className="text-2xl font-serif text-château-parchment mb-4">
              Something went wrong
            </h2>
            <p className="text-château-parchment/60 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} variant="primary" className="w-full">
                Refresh Page
              </Button>
              <Button onClick={this.handleReset} variant="ghost" className="w-full">
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-château-parchment/40 text-sm cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-château-parchment/30 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}