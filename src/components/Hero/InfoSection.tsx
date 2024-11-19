// src/components/Hero/InfoSection.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface InfoSectionProps {
  title: string;
  subtitle: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, subtitle }) => {
  // Define animation variants for the heading and paragraph
  const variants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 flex justify-center">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center max-w-6xl px-4 md:px-8">
        {/* Animated Heading */}
        <motion.div
          initial="hiddenLeft"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          variants={variants}
          className="text-center sm:text-left font-primary"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white">
            <span className="text-lemonGreen-light">{title}</span>
            <span className="block text-gray-800 dark:text-gray-200">{subtitle}</span>
          </h1>
        </motion.div>

        {/* Animated Paragraph */}
        <motion.div
          initial="hiddenRight"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          variants={variants}
          className="text-center sm:text-left text-gray-600 dark:text-gray-300 sm:max-w-lg leading-relaxed font-secondary"
        >
          <p>
            LogaXP is your trusted partner for cutting-edge software products. Our team of IT engineers and developers is dedicated to crafting solutions that elevate your business and keep you above the competition.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;
