// src/components/common/LoadingSpinner/LoadingSpinner.types.ts

export interface SpinnerProps {
    /**
     * Size of the spinner.
     * @default 'md'
     */
    size?: 'sm' | 'md' | 'lg';
  
    /**
     * Color of the spinner.
     * @default 'lemonGreen'
     */
    color?: 'lemonGreen' | 'blue' | 'red' | 'gray';
  
    /**
     * Accessible label for the spinner.
     * @default 'Loading...'
     */
    ariaLabel?: string;
  }
  