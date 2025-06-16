"use client";
import React, { useState, useEffect } from "react";
import clsx from "clsx";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  variant?: "default" | "hiring" | "search" | "upload";
}

const hiringMessages = [
  "🔍 Searching for the perfect match...",
  "📝 Reviewing applications...",
  "💼 Finding amazing opportunities...",
  "🚀 Connecting talent with companies...",
  "⭐ Discovering your next career move...",
  "🎯 Matching skills with requirements...",
];

const hiringEmojis = ["💼", "📋", "🏢", "👔", "💻", "📊", "🎯", "⭐"];

export function Loader({ 
  size = "md", 
  text, 
  className = "",
  variant = "default" 
}: LoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  useEffect(() => {
    if (variant === "hiring") {
      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % hiringMessages.length);
      }, 2000);

      const emojiInterval = setInterval(() => {
        setCurrentEmojiIndex((prev) => (prev + 1) % hiringEmojis.length);
      }, 800);

      return () => {
        clearInterval(messageInterval);
        clearInterval(emojiInterval);
      };
    }
  }, [variant]);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const emojiSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  const renderLoaderContent = () => {
    switch (variant) {
      case "hiring":
        return (
          <div className="relative flex items-center justify-center">
            {/* Outer rotating ring */}
            <div
              className={clsx(
                "rounded-full border-4 border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-orange-500 animate-spin",
                sizeClasses[size]
              )}
            ></div>
            
            {/* Inner pulsing ring */}
            <div
              className={clsx(
                "absolute rounded-full border-2 border-blue-300 animate-ping opacity-75",
                sizeClasses[size]
              )}
            ></div>

            {/* Center animated emoji */}
            <div className={clsx(
              "absolute animate-bounce",
              emojiSizeClasses[size]
            )}>
              {hiringEmojis[currentEmojiIndex]}
            </div>
          </div>
        );
        
      case "search":
        return (
          <div className="relative flex items-center justify-center">
            <div
              className={clsx(
                "rounded-full border-4 border-dashed border-blue-500 animate-spin",
                sizeClasses[size]
              )}
            ></div>
            <div className={clsx(
              "absolute animate-pulse",
              emojiSizeClasses[size]
            )}>
              🔍
            </div>
          </div>
        );
        
      case "upload":
        return (
          <div className="relative flex items-center justify-center">
            <div
              className={clsx(
                "rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin",
                sizeClasses[size]
              )}
            ></div>
            <div className={clsx(
              "absolute animate-bounce",
              emojiSizeClasses[size]
            )}>
              📤
            </div>
          </div>
        );
        
      default:
        return (
          <div className="relative flex items-center justify-center">
            <div
              className={clsx(
                "rounded-full border-4 border-dashed border-blue-500 animate-spin",
                sizeClasses[size]
              )}
            ></div>
            <div className={clsx(
              "absolute animate-bounce delay-200",
              emojiSizeClasses[size]
            )}>
              💼
            </div>
          </div>
        );
    }
  };

  const displayText = variant === "hiring" && !text 
    ? hiringMessages[currentMessageIndex] 
    : text;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center space-y-4",
        className
      )}
    >
      {renderLoaderContent()}

      {displayText && (
        <div className="text-center max-w-xs">
          <p
            className={clsx(
              "text-gray-600 font-medium animate-pulse",
              textSizeClasses[size]
            )}
          >
            {displayText}
          </p>
          {variant === "hiring" && (
            <div className="flex justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Full screen loader with hiring theme
export function FullScreenLoader({
  text,
  variant = "hiring",
}: {
  text?: string;
  variant?: "default" | "hiring" | "search" | "upload";
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/30">
        <Loader size="xl" text={text} variant={variant} />
      </div>
    </div>
  );
}

// Page loader with hiring theme
export function PageLoader({
  text,
  variant = "hiring",
}: {
  text?: string;
  variant?: "default" | "hiring" | "search" | "upload";
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="text-center bg-white rounded-2xl p-12 shadow-xl border border-gray-200">
        <Loader size="lg" text={text} variant={variant} />
      </div>
    </div>
  );
}

// Button loader
export function ButtonLoader({
  size = "sm",
  className = "",
  variant = "default",
}: {
  size?: "sm" | "md";
  className?: string;
  variant?: "default" | "hiring" | "search" | "upload";
}) {
  return <Loader size={size} className={clsx("inline-flex", className)} variant={variant} />;
}

// Hiring specific loader
export function HiringLoader({
  size = "lg",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return <Loader size={size} className={className} variant="hiring" />;
}

export default Loader;
