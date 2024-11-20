import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '../../assets/images/docu.png';
import logo2 from '../../assets/images/logox.png';
import logo3 from '../../assets/images/bookmiz.png';
import logo4 from '../../assets/images/logo.png';
import logo5 from '../../assets/images/mylogo.png';
import logo6 from '../../assets/images/logo5.png';
import logo7 from '../../assets/images/docu.png';
import logo8 from '../../assets/images/bookmiz.png';

const Trusts: React.FC = () => {
  const trustLogos = [
    { src: logo1, alt: 'GatherPlux' },
    { src: logo2, alt: 'DocSend' },
    { src: logo3, alt: 'BookMiz' },
    { src: logo4, alt: 'TimeSync' },
    { src: logo5, alt: 'LogaBeauty' },
    { src: logo6, alt: 'ProFixer' },
    { src: logo7, alt: 'LogaBeauty' },
    { src: logo8, alt: 'ProFixer' },
  ];

  // Duplicate logos for seamless infinite scrolling
  const extendedLogos = [...trustLogos, ...trustLogos];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
    {/* Header Section */}
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-deepBlue-dark dark:text-lemonGreen">
        Trusted by Leading Partners
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
        We collaborate with industry-leading brands to provide exceptional solutions that drive success.
      </p>
    </div>

      {/* Scrolling Logos Section */}
      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-16 items-center whitespace-nowrap"
          initial={{ x: '20%' }}
          animate={{ x: '-60%' }}
          transition={{
            duration: 50, // Adjust scrolling speed
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {extendedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform transform hover:scale-110 h-40 w-40 sm:h-48 sm:w-48"
            >
              {/* Logo */}
              <img
                src={logo.src}
                alt={logo.alt}
                 className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-xl mx-auto h-44 w-40 items-center justify-center"
              />
             
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Fading Effects for Smooth Edges */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-gray-50 dark:from-gray-900 via-transparent to-transparent z-10"></div>
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-gray-50 dark:from-gray-900 via-transparent to-transparent z-10"></div>
      </div>
    </section>
  );
};

export default Trusts;
