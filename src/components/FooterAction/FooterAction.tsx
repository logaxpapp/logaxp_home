import React from 'react';
import { Link } from 'react-router-dom';
import ScaleOut from '../Slides/ScaleOut';
import routes from '../../routing/routes';

const FooterAction: React.FC = () => {
  return (
    <ScaleOut className="relative py-12 px-4 sm:px-8 lg:px-16 bg-deepBlue-dark flex flex-col items-center text-white text-center">
      {/* Title Section */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-wide">
        Looking for effective solutions to boost your business?
        <span className="block mt-4">
          <span className="text-lemonGreen">Try LogaXP</span>&nbsp;today!
        </span>
      </h2>

      {/* Call-to-Action Button */}
      <Link
        to={routes.allProducts}
        className="bg-white text-deepBlue font-bold px-8 py-4 rounded-full shadow-lg hover:bg-lemonGreen hover:text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Products
      </Link>

      {/* Background Design */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Glow Effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 sm:w-56 sm:h-56 rounded-full blur-3xl opacity-50"></div>
        {/* Bottom Glow Effect */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-40 sm:w-56 sm:h-56 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Gradient Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 "></div>
    </ScaleOut>
  );
};

export default FooterAction;
