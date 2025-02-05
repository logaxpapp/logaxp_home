import React from 'react';
import { Link } from 'react-router-dom'; 
// or remove if you're not using React Router

// Replace with your own images
import mainBeautyImage from '../../assets/images/beauty-hero.jpg';
import nailsImage from '../../assets/images/nails.jpg';
import hairMakeupImage from '../../assets/images/hair-makeup.jpg';
import clientSmilingImage from '../../assets/images/client-smile.jpg';

const AboutBeautyHubTeaser: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#4e0c0c] to-[#6d1a1a] text-white py-16 px-6 md:px-12 overflow-hidden">
      {/* Background styling or background image (optional) */}
      <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* LEFT: Text Content */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <h5 className="text-pink-200 font-semibold text-sm uppercase tracking-wide">
            About Us
          </h5>
          <h2 className="text-3xl md:text-4xl font-bold">
            Our Story
          </h2>
          <hr className="w-16 border-pink-200 mb-3" />

          <p className="text-sm md:text-base leading-relaxed">
            In the heart of innovation, <strong>BeautyHub</strong> emerged as more 
            than just a platform—it became a virtual oasis for self-care, fashion, 
            and empowerment. Built on the belief that true beauty is a personalized 
            experience, our SaaS solution brings together a diverse range of 
            beauty professionals and clients under one digital roof.
          </p>
          <p className="text-sm md:text-base leading-relaxed">
            Whether it’s nail artistry, hair styling, spa treatments, or skincare, 
            BeautyHub offers a marketplace where customers can browse top-notch 
            services, interact with providers, and seamlessly book appointments. 
            Secure payments, no-show fee protection, and auto-confirm bookings are 
            just the start—because at BeautyHub, our vision is to transform 
            every self-care moment into a vibrant, hassle-free experience.
          </p>

          {/* Read More button -> Goes to the detailed page */}
          <div>
            <Link
              to="/beautyhub-full-story" 
              // If using React Router; or replace with a modal toggle
              className="inline-block bg-gray-100 text-gray-900 font-semibold px-5 py-2 rounded-md shadow hover:bg-gray-200 transition-colors"
            >
              Read more...
            </Link>
          </div>
        </div>

        {/* RIGHT: Image Collage or Stacked Images */}
        <div className="flex-1 flex justify-end relative">
          <div className="grid grid-cols-2 gap-3">
            <img
              src={mainBeautyImage}
              alt="BeautyHub highlight"
              className="rounded shadow-md object-cover h-40 md:h-52 w-full"
            />
            <img
              src={nailsImage}
              alt="Nails design"
              className="rounded shadow-md object-cover h-40 md:h-52 w-full"
            />
            <img
              src={hairMakeupImage}
              alt="Hair & makeup"
              className="rounded shadow-md object-cover h-40 md:h-52 w-full"
            />
            <img
              src={clientSmilingImage}
              alt="Happy client"
              className="rounded shadow-md object-cover h-40 md:h-52 w-full"
            />
          </div>
        </div>
      </div>

      {/* OPTIONAL: A small highlight badge for “8 yrs Experience” or others */}
      <div className="absolute bottom-6 left-6 bg-black bg-opacity-40 px-3 py-2 rounded">
        <p className="text-xs md:text-sm font-semibold flex items-center gap-2 text-pink-100">
          <span className="material-icons text-pink-200 text-base">grade</span> 
          8 yrs Experience
        </p>
      </div>
    </section>
  );
};

export default AboutBeautyHubTeaser;
