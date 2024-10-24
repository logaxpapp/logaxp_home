// src/components/Slides/SlideFromLeft.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SlideFromLeftProps {
  children: React.ReactNode;
  className?: string;
}

const SlideFromLeft: React.FC<SlideFromLeftProps> = ({ children, className }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default SlideFromLeft;
