// src/components/Slides/SlideFromBottom.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface SlideFromBottomProps {
  children: React.ReactNode;
  className?: string;
}

const SlideFromBottom: React.FC<SlideFromBottomProps> = ({ children, className }) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className={className}
  >
    {children}
  </motion.div>
);

export default SlideFromBottom;
