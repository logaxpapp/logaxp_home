import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScaleOut from '../Slides/ScaleOut';
import routes from '../../routing/routes';
import HeroVideo from '../../assets/videos/hero3.mp4';
import Hero2Video from '../../assets/videos/hero.mp4';
import InfoSection from './InfoSection';
import HighlightsSection from './HighlightsSection';

const Hero: React.FC = () => {
  const [showFirstVideo, setShowFirstVideo] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Toggle between true and false every 2 minutes
      setShowFirstVideo(prev => !prev);
    }, 120000); // 2 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="relative w-full h-[580px] px-4 md:px-8 lg:px-16 flex flex-col justify-center items-center overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Background Video */}
        <div className="absolute inset-0 h-full w-full overflow-hidden z-0">
          <video
            className="w-full h-full object-cover"
            src={showFirstVideo ? HeroVideo : Hero2Video}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Semi-transparent Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-50" />
        </div>

        {/* Hero Content Overlay */}
        <ScaleOut className="relative w-full flex flex-col items-center z-10 text-center pt-10">
          {/* Tagline for Desktop */}
          <p className="hidden sm:block font-primary px-4 py-2 border my-2 mb-4 border-lemonGreen-light dark:border-lemonGreen rounded-full font-semibold text-sm md:text-base uppercase tracking-wide text-white">
            Transform Your Business with Tailored IT Solutions
          </p>

          {/* Tagline for Mobile */}
          <p className="block sm:hidden font-primary px-4 py-2 border my-2 mb-4 border-lemonGreen-light dark:border-lemonGreen rounded-full font-semibold text-sm uppercase tracking-wide text-white">
            We Transform Business Productivity
          </p>

          {/* Main Heading */}
          <h1 className="font-primary text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-4xl mb-4 text-white">
            <div>
              <span>Empowering You </span>
              <span className="text-lemonGreen-light">&nbsp;for Success&nbsp;</span>
              <span>Through Innovation</span>
            </div>
          </h1>

          {/* Supporting Text */}
          <p className="text-white mt-4 max-w-lg sm:max-w-xl md:max-w-2xl mb-8 font-secondary text-sm md:text-base">
            Discover cutting-edge solutions designed to streamline operations, boost productivity, and drive your business forward. With LogaXP, experience technology that works as hard as you do.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 mb-12">
            <Link
              className="bg-lemonGreen-light text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-lemonGreen-light hover:border-lemonGreen-light hover:border transition-all duration-300 text-sm md:text-base"
              to={routes.allProducts}
            >
              Explore Services
            </Link>
            <Link
              className="bg-transparent text-lemonGreen-light font-bold px-6 py-3 border border-lemonGreen-light rounded-lg hover:bg-lemonGreen-light hover:text-white transition-all duration-300 text-sm md:text-base"
              to={routes.contact}
            >
              Get in Touch
            </Link>
          </div>
        </ScaleOut>
      </section>

      {/* Additional Info Section */}
      <InfoSection title="Tailored IT Solutions" subtitle="Driving Your Success" />

      {/* Highlights Section */}
      <HighlightsSection />
    </>
  );
};

export default Hero;
