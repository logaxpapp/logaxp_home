// src/components/Hero/Hero.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import ScaleOut from '../Slides/ScaleOut'; // Ensure this component is correctly implemented
import routes from '../../routing/routes';
import banner from '../../assets/images/banner.jpeg';
import InfoSection from './InfoSection'; // Import the newly created InfoSection component

const Hero: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full pt-9 px-0 md:px-6 md:pt-7 flex flex-col gap-10 items-center bg-gray-50 dark:bg-gray-800">
        <ScaleOut className="w-full flex flex-col items-center">
          {/* Tagline */}
          <p className="px-8 py-2 border my-4 border-black dark:border-white rounded-full font-display font-semibold text-center text-[10px] md:text-sm mb-8 dark:text-white">
            INNOVATION MEETS EXCELLENCE IN HR SOLUTIONS AND CUSTOM IT SERVICES
          </p>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight max-w-4xl mb-4">
            <div>
              <span className="dark:text-white">Unlock Efficiency And</span>
              <span className="text-lemonGreen-light">&nbsp;Boost&nbsp;</span>
              <span className="dark:text-white">Performance</span>
            </div>
            <div>
              <span className="dark:text-white">With Our Cutting-edge&nbsp;</span>
              <span className="text-lemonGreen-light">Solutions</span>
            </div>
          </h1>

          {/* Supporting Text */}
          <p className="text-center text-gray-500 mt-4 max-w-xl mb-8 dark:text-gray-300">
            LogaXP is your trusted partner for cutting-edge software products. Our team of IT engineers and developers is dedicated to crafting solutions that elevate your business and keep you above the competition.
          </p>

          {/* Call to Action */}
          <div className="flex justify-center mt-6 mb-12 bg-gray-50 dark:bg-gray-800">
            <Link
              className="bg-lemonGreen-light text-gray-700 dark:text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
              to={routes.allProducts}
            >
              Explore Our Services
            </Link>
          </div>
        </ScaleOut>
      </section>

      {/* Banner Section */}
      <section className="flex justify-center bg-gray-50 dark:bg-gray-800">
        <img
          alt="banner"
          className="w-full md:w-3/4 h-auto rounded-lg dark:filter dark:brightness-75"
          src={banner}
        />
      </section>

      {/* Additional Info Section */}
      <InfoSection title="Effective Solution" subtitle="for your business" />
    </>
  );
};

export default Hero;
