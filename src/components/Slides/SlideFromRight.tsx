// src/components/Slides/SlideFromRight.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SlideFromRightProps {
  children: React.ReactNode;
  className?: string;
}

const SlideFromRight: React.FC<SlideFromRightProps> = ({ children, className }) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default SlideFromRight;
