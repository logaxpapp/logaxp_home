// src/components/Slides/ScaleOut.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface ScaleOutProps {
  children: React.ReactNode;
  className?: string;
}

const ScaleOut: React.FC<ScaleOutProps> = ({ children, className }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ScaleOut;
