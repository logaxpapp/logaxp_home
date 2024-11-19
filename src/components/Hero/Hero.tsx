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
      <section className="w-full pt-8 px-4 md:px-6 md:pt-7 flex flex-col gap-8 items-center bg-gray-50 dark:bg-gray-800">
        <ScaleOut className="w-full flex flex-col items-center">
          {/* Tagline */}
          <p className="font-primary px-6 py-2 border my-2 text-deepBlue-dark border-black dark:border-white rounded-full font-display font-semibold text-center text-xs md:text-sm dark:text-white">
            INNOVATION MEETS EXCELLENCE IN HR SOLUTIONS AND CUSTOM IT SERVICES
          </p>

          {/* Main Heading */}
          <h1 className="font-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-tight max-w-4xl mb-4 text-deepBlue-dark">
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
          <p className="text-center text-gray-500 mt-4 max-w-md sm:max-w-lg md:max-w-xl mb-8 dark:text-gray-300 font-secondary">
            LogaXP is your trusted partner for cutting-edge software products. Our team of IT engineers and developers is dedicated to crafting solutions that elevate your business and keep you above the competition.
          </p>

          {/* Call to Action */}
          <div className="flex justify-center mt-6 mb-12">
            <Link
              className="bg-lemonGreen-light text-white font-bold dark:text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
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
          className="w-full md:w-3/4 h-auto object-cover rounded-lg dark:filter dark:brightness-75"
          src={banner}
        />
      </section>

      {/* Additional Info Section */}
      <InfoSection title="Effective Solution" subtitle="for your business" />
    </>
  );
};

export default Hero;
