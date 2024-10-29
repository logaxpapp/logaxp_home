import React from 'react';
import { Link } from 'react-router-dom';
import ScaleOut from '../Slides/ScaleOut';
import routes from '../../routes/routes';

const FooterAction: React.FC = () => {
  return (
    <ScaleOut className="py-12 bg-deepBlue-dark flex flex-col items-center text-white text-center mb-20">
      {/* Title with subtle text shadow */}
      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-wide">
        Looking for effective solutions to boost your business?
        <span className="text-white font-extrabold shadow-2xl block mt-2">
          Try&nbsp;<span className="text-lemonGreen">LogaXP</span>&nbsp;today!
        </span>
      </h2>

      {/* Explore Button */}
      <Link
        to={routes.allProducts}
        className="bg-white text-deepBlue font-bold px-8 py-4 rounded-full shadow-lg hover:bg-lemonGreen hover:text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        Explore Products
      </Link>

      {/* Decorative Elements - Optional */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-deepBlue via-lemonGreen to-lemonGreen"></div>
    </ScaleOut>
  );
};

export default FooterAction;
