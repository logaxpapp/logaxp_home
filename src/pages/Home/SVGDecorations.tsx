// src/components/SVGDecorations.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface SVGProps {
  className?: string;
}

export const CrossSVG: React.FC<SVGProps> = ({ className }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className={`text-gray-300 ${className}`}
    viewBox="0 0 14 14"
    fill="currentColor"
    aria-hidden="true"
    animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 0.9] }}
    transition={{ repeat: Infinity, duration: 20, delay: Math.random() * 3, ease: "easeInOut" }}
  >
    <path d="M12 17.27L18.18 21 16.545 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.455 13.97 5.82 21z" />
  </motion.svg>
);

export const StarSVG: React.FC<SVGProps> = ({ className }) => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    className={`text-gray-400 dark:text-white ${className}`}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
    animate={{ opacity: [0, 1, 0], scale: [0.9, 1, 0.9] }}
    transition={{ repeat: Infinity, duration: 20, delay: Math.random() * 3, ease: "easeInOut" }}
  >
    <path d="M12 2.25l2.917 6.006H22l-5.833 4.237L18.834 22.75L12 18.764L5.166 22.75L7.833 12.493L2 8.256h7.083L12 2.25z" />
  </motion.svg>
);
