import React from 'react';

interface TruncatedTitleProps {
  text: string; // The input text to format and truncate
  wordLimit: number; // Maximum number of words to display
  className?: string; // Optional className for custom styles
}

/**
 * TruncatedTitle Component
 * - Formats and truncates a string based on the specified word limit.
 * - Capitalizes the first letter of the string.
 */
const TruncatedTitle: React.FC<TruncatedTitleProps> = ({ text, wordLimit, className }) => {
  // Utility to capitalize and truncate the title
  const formatTitle = (text: string, wordLimit: number): string => {
    if (!text) return '';

    // Split the text into words
    const words = text.trim().split(' ');

    // Capitalize the first letter
    const capitalizedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    // Truncate to the word limit
    const truncatedText = words.slice(0, wordLimit).join(' ');

    // Add ellipsis if the text exceeds the word limit
    return words.length > wordLimit ? `${truncatedText}...` : capitalizedText;
  };

  return <span className={className}>{formatTitle(text, wordLimit)}</span>;
};

export default TruncatedTitle;
