import React from 'react';
import { FaCogs, FaChartLine, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HighlightsSection = () => {
  // Parent container variants for a subtle scale and fade-in
  const containerVariants = {
    initial: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.25,
      },
    },
  };

  // Each card fade-up + scale variants
  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.section
      className="
        relative py-12 px-4 md:px-8 lg:px-16 overflow-hidden
        bg-gray-50 dark:bg-gray-800
      "
      variants={containerVariants}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto text-center mb-10 relative z-10">
        <h2 className="font-primary text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Why Choose LogaXP?
        </h2>
        <p className="text-gray-500 dark:text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
          We provide custom-tailored solutions that align with your goals, streamline workflows, and keep you competitive in a rapidly evolving market.
        </p>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10"
      >
        {/* Card 1 */}
        <motion.div
          className="flex flex-col items-center gap-4 bg-slate-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition"
          variants={cardVariants}
        >
          <FaCogs className="text-lemonGreen-light text-4xl" />
          <h3 className="font-primary text-xl font-semibold text-deepBlue-dark dark:text-white">
            Customized Solutions
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            We tailor our services to meet your unique requirements, ensuring you get exactly what you need to thrive.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="flex flex-col items-center gap-4 bg-slate-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition"
          variants={cardVariants}
        >
          <FaChartLine className="text-lemonGreen-light text-4xl" />
          <h3 className="font-primary text-xl font-semibold text-deepBlue-dark dark:text-white">
            Growth-Driven Approach
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Our strategies focus on efficiency and productivity, helping you scale and succeed in today's dynamic environment.
          </p>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          className="flex flex-col items-center gap-4 bg-slate-100 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition"
          variants={cardVariants}
        >
          <FaUsers className="text-lemonGreen-light text-4xl" />
          <h3 className="font-primary text-xl font-semibold text-deepBlue-dark dark:text-white">
            Support & Partnership
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            We stand by you every step of the way, offering ongoing support, training, and resources to keep you moving forward.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HighlightsSection;
