import React from 'react';
import { motion } from 'framer-motion';
import logo1 from '../../assets/images/logo1.png';
import logo2 from '../../assets/images/logo2.png';
import logo3 from '../../assets/images/logo3.png';
import logo4 from '../../assets/images/logo4.png';

const Trusts: React.FC = () => {
  const trustLogos = [
    { src: logo1, name: 'Partner 1' },
    { src: logo2, name: 'Partner 2' },
    { src: logo3, name: 'Partner 3' },
    { src: logo4, name: 'Partner 4' },
  ];

  // Create an extended list of logos to ensure continuous scrolling without gaps
  const extendedLogos = [...trustLogos, ...trustLogos, ...trustLogos, ...trustLogos]; 

  return (
    <section className="py-8 bg-white dark:bg-gray-800 overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 dark:text-white">
        Our Trusted Partners
      </h2>

      <div className="relative">
        <div className="container mx-auto overflow-hidden">
          <motion.div
            className="flex gap-16 items-center whitespace-nowrap"
            initial={{ x: '0%' }} // Start at the initial position
            animate={{ x: '-100%' }} // Move left
            transition={{
              duration: 60, // Adjust the duration for slower/faster speed
              repeat: Infinity, // Infinite loop
              ease: 'linear', // Maintain constant speed
            }}
          >
            {/* Display logos and names continuously */}
            {extendedLogos.map((logo, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.2 }} // Scale up on hover
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src={logo.src}
                  alt={`Trust Logo ${logo.name}`}
                  className="h-16 w-16 object-contain mb-2"
                />
                <p className="text-gray-600 dark:text-gray-300 font-semibold text-center">
                  {logo.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Trusts;
