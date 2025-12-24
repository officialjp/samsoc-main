'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-screen flex-col items-center justify-center p-4">
					<div className="max-w-md rounded-2xl border-2 border-black bg-white p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						<AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
						<h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
						<p className="mb-6 text-gray-600">
							We encountered an unexpected error. Please try refreshing the page.
						</p>
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className="mb-4 text-left">
								<summary className="cursor-pointer text-sm font-medium text-gray-700">
									Error details
								</summary>
								<pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
									{this.state.error.toString()}
								</pre>
							</details>
						)}
						<div className="flex gap-4">
							<Button
								onClick={this.handleReset}
								className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-button1"
							>
								Try again
							</Button>
							<Button
								onClick={() => window.location.reload()}
								className="border-2 border-black bg-button2 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-button1"
							>
								Reload page
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

