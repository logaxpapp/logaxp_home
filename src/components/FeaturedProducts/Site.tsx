import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

interface SiteProps {
  product: {
    homePoster: string;
    title: string;
    homePage: string;
    summary: string;
    features: string[];
  };
  index: number;
}

const Site: React.FC<SiteProps> = ({ product, index }) => {
  const { ref, inView } = useInView({
    triggerOnce: false, // Allow animations to trigger every time the card enters the viewport
    threshold: 0.1,
  });

  const isEven = index % 2 === 0;

  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: isEven ? -100 : 100 },
    visible: { opacity: 1, x: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col md:flex-row ${!isEven ? 'md:flex-row-reverse' : ''} gap-8 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden mb-10`}
    >
      {/* Text Section */}
      <motion.div
        className="p-6 bg-gray-50 dark:bg-gray-800 flex flex-col justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {product.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4">{product.summary}</p>

        <ul className="list-inside mb-4 text-gray-600 dark:text-gray-300">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start mb-2">
              <span className="text-lemonGreen mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>

        <Link
          to={product.homePage}
          target="_blank"
          rel="noreferrer"
          className="inline-block border-2 w-1/3 items-center justify-center text-center border-lemonGreen-light text-lemonGreen-dark px-6 py-2 rounded-full hover:bg-lemonGreen hover:text-white transition-colors duration-200"
        >
          Explore
        </Link>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="relative flex-shrink-0 w-full md:w-1/2 h-64 sm:h-72 lg:h-80"
        variants={imageVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <img
          className="w-full h-full object-cover rounded-lg"
          src={product.homePoster || 'https://via.placeholder.com/300'}
          alt={`${product.title} Poster`}
        />
      </motion.div>
    </motion.div>
  );
};

export default Site;
