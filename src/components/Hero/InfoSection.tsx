import React from 'react';
import { motion } from 'framer-motion';

interface InfoSectionProps {
  title: string;
  subtitle: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, subtitle }) => {
  // Container animation: stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.15,
      },
    },
  };

  // Fade and slide/scale variants for child elements
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 },
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800 flex justify-center px-6 md:px-12">
      <motion.div
        className="max-w-3xl w-full flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        {/* Animated Heading and Subtitle */}
        <motion.div variants={scaleInVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white leading-tight">
            <span className="text-lemonGreen-light">{title}</span>
            <span className="block text-gray-800 dark:text-gray-200 mt-2">{subtitle}</span>
          </h1>
        </motion.div>

        {/* Decorative Animated Line */}
        <motion.div
          className="h-1 w-24 bg-lemonGreen-light mt-6 mb-10 origin-center"
          variants={lineVariants}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          initial="hidden"
          animate="visible"
        />

        {/* Animated Paragraph */}
        <motion.p
          variants={fadeUpVariants}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed font-secondary max-w-xl"
        >
          Discover innovative solutions tailored to your business needs. With LogaXP, you gain
          access to a dedicated team of IT experts committed to driving your growth and success.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default InfoSection;
