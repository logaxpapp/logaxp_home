// src/components/Trusts.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import logo1 from '../../assets/images/docu.png';
import logo2 from '../../assets/images/logox.png';
import logo3 from '../../assets/images/bookmiz.png';
import logo4 from '../../assets/images/logo.png';
import logo5 from '../../assets/images/mylogo.png';
import logo6 from '../../assets/images/logo5.png';
import logo7 from '../../assets/images/docu.png'; // Ensure uniqueness if needed
import logo8 from '../../assets/images/bookmiz.png'; // Ensure uniqueness if needed

const Trusts: React.FC = () => {
  const trustLogos = [
    { src: logo1, alt: 'GatherPlux' },
    { src: logo2, alt: 'DocSend' },
    { src: logo3, alt: 'BookMiz' },
    { src: logo4, alt: 'TimeSync' },
    { src: logo5, alt: 'LogaBeauty' },
    { src: logo6, alt: 'ProFixer' },
    { src: logo7, alt: 'LogaBeauty2' }, // Ensure uniqueness if needed
    { src: logo8, alt: 'ProFixer2' },  // Ensure uniqueness if needed
  ];

  const logosPerPage = 4;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pageCount = Math.ceil(trustLogos.length / logosPerPage);

  const canGoBack = page > 0;
  const canGoNext = page < pageCount - 1;

  const displayedLogos = trustLogos.slice(
    page * logosPerPage,
    page * logosPerPage + logosPerPage
  );

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    animate: {
      x: '0%',
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeIn' },
    }),
  };

  const nextPage = () => {
    setDirection(1);
    setPage((prev) => (prev < pageCount - 1 ? prev + 1 : 0)); // Loop back to the start
  };

  const prevPage = () => {
    setDirection(-1);
    setPage((prev) => (prev > 0 ? prev - 1 : pageCount - 1)); // Loop back to the end
  };

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        nextPage();
      }
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused, page]);

  return (
    <section
      className="py-20 px-4 md:px-8 lg:px-16 bg-deepBlue-dark dark:bg-gray-800 relative text-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto mb-10">
        <h2 className="font-primary text-3xl md:text-4xl font-bold text-white">
          Trusted by Leading Partners
        </h2>
        <p className="text-gray-300 mt-4 max-w-3xl mx-auto text-sm md:text-base">
          We collaborate with industry-leading brands to provide exceptional solutions that drive success.
        </p>
      </div>

      <div className="relative max-w-5xl mx-auto overflow-hidden h-32"> {/* Adjust height as needed */}
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 w-full grid grid-cols-2 sm:grid-cols-4 gap-8"
            >
              {displayedLogos.map((logo, index) => (
                <motion.div
                  key={logo.alt + index} // Ensure unique key
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-2xl transition transform"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-20 w-auto object-contain"
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={prevPage}
            disabled={!canGoBack}
            className={`bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition ${
              !canGoBack ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Previous Logos"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextPage}
            disabled={!canGoNext}
            className={`bg-gray-600 text-white p-2 rounded-full hover:bg-gray-500 transition ${
              !canGoNext ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Next Logos"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === page ? 'bg-green-400' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trusts;
