import { memo } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

const LoadingSpinner = memo(function LoadingSpinner({ message = "Loading...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <div className="text-white text-xl select-none">{message}</div>
      </div>
    </div>
  );
});

export default LoadingSpinner;
