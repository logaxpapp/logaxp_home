import React from 'react';
import banner from '../../assets/images/banner.jpeg';

const Banner: React.FC = () => {
  return (
    <section className="flex justify-center bg-gray-50 py-6 dark:bg-gray-800">
      <img
        src={banner}
        alt="Company Banner"
        className="w-full md:w-3/4 h-auto rounded-lg shadow-lg object-cover transition-transform duration-500 transform hover:scale-105"
      />
    </section>
  );
};

export default Banner;
