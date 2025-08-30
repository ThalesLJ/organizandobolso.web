import { memo } from 'react';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorDisplay = memo(function ErrorDisplay({ message = "Error loading data", onRetry, className = "" }: ErrorDisplayProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <div className="text-white text-xl mb-4 select-none">{message}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 select-none"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
});

export default ErrorDisplay;
