import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

export function Loader({ size = 'md', text, className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className={`${sizeClasses[size]} border-4 border-transparent border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
        
        {/* Inner ring */}
        <div className={`absolute inset-2 border-2 border-gray-100 rounded-full animate-spin-reverse`}>
          <div className={`w-full h-full border-2 border-transparent border-b-white rounded-full animate-spin-reverse`}></div>
        </div>
      </div>
      
      {text && (
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Full screen loader
export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
      <Loader size="xl" text={text} />
    </div>
  );
}

// Page loader
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader size="lg" text={text} />
      </div>
    </div>
  );
}

// Button loader
export function ButtonLoader({ size = 'sm', className = '' }: { size?: 'sm' | 'md'; className?: string }) {
  return (
    <Loader 
      size={size} 
      className={`inline-flex ${className}`} 
    />
  );
}

export default Loader;
