import React from 'react';
import { Link } from 'react-router-dom';
import ScaleOut from '../Slides/ScaleOut';
import routes from '../../routing/routes';
import banner from '../../assets/images/banner.jpeg';
import InfoSection from './InfoSection';

const Hero: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full pt-10 px-4 md:px-8 lg:px-16 flex flex-col gap-6 items-center bg-gray-50 dark:bg-gray-900">
        <ScaleOut className="w-full flex flex-col items-center">
          {/* Tagline for Desktop */}
          <p className="hidden sm:block font-primary px-4 py-2 border my-2 mb-4 text-deepBlue-dark border-lemonGreen-light dark:border-lemonGreen rounded-full font-semibold text-center text-sm md:text-base dark:text-white uppercase tracking-wide">
            Transform Your Business with Tailored IT Solutions
          </p>

          {/* Tagline for Mobile */}
          <p className="block sm:hidden font-primary px-4 py-2 border my-2 mb-4 text-deepBlue-dark border-lemonGreen-light dark:border-lemonGreen rounded-full font-semibold text-center text-sm dark:text-white uppercase tracking-wide">
            We Transform Business Productivity
          </p>

          {/* Main Heading */}
          <h1 className="font-primary text-2xl sm:text-4xl md:text-5xl font-extrabold text-center leading-tight max-w-4xl mb-4 text-deepBlue-dark dark:text-white">
            <div>
              <span>Empowering You </span>
              <span className="text-lemonGreen-light">&nbsp;for Success&nbsp;</span>
              <span>Through Innovation</span>
            </div>
          </h1>

          {/* Supporting Text */}
          <p className="text-center text-gray-600 mt-4 max-w-lg sm:max-w-xl md:max-w-2xl mb-8 dark:text-gray-300 font-secondary text-sm md:text-base">
            Discover cutting-edge solutions designed to streamline operations, boost productivity, and drive your business forward. With LogaXP, experience technology that works as hard as you do.
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 mb-12">
            <Link
              className="bg-lemonGreen-light text-white font-bold dark:text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-300 text-sm md:text-base"
              to={routes.allProducts}
            >
              Explore Services
            </Link>
            <Link
              className="bg-transparent text-lemonGreen-light font-bold dark:text-lemonGreen-light px-6 py-3 border border-lemonGreen-light rounded-lg hover:bg-lemonGreen-light hover:text-white transition-all duration-300 text-sm md:text-base"
              to={routes.contact}
            >
              Get in Touch
            </Link>
          </div>
        </ScaleOut>
      </section>

      {/* Banner Section */}
      <section className="flex justify-center bg-gray-50 dark:bg-gray-900 p-8 md:p-16">
        <img
          alt="banner"
          className="w-full md:w-3/4 lg:w-5/6 h-auto object-cover rounded-lg shadow-lg dark:filter dark:brightness-90"
          src={banner}
        />
      </section>

      {/* Additional Info Section */}
      <InfoSection title="Tailored IT Solutions" subtitle="Driving Your Success" />
    </>
  );
};

export default Hero;





// // src/components/Hero/Hero.tsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import ScaleOut from '../Slides/ScaleOut'; // Ensure this component is correctly implemented
// import routes from '../../routing/routes';
// import banner from '../../assets/images/banner.jpeg';
// import InfoSection from './InfoSection'; // Import the newly created InfoSection component

// const Hero: React.FC = () => {
//   return (
//     <>
//       {/* Hero Section */}
//       <section className="w-full pt-9 px-0 md:px-6 md:pt-7 flex flex-col gap-10 items-center bg-gray-50 dark:bg-gray-800">
//         <ScaleOut className="w-full flex flex-col items-center">
//           {/* Tagline */}
//           <p className="font-primary px-8 py-2 border my-4 text-deepBlue-dark border-black dark:border-white rounded-full font-display font-semibold text-center text-[10px] md:text-sm mb-8 dark:text-white">
//             INNOVATION MEETS EXCELLENCE IN HR SOLUTIONS AND CUSTOM IT SERVICES
//           </p>

//           {/* Main Heading */}
//           <h1 className="font-primary text-3xl md:text-5xl font-bold text-center leading-tight max-w-4xl mb-4 text-deepBlue-dark">
//             <div>
//               <span className="dark:text-white">Unlock Efficiency And</span>
//               <span className="text-lemonGreen-light">&nbsp;Boost&nbsp;</span>
//               <span className="dark:text-white">Performance</span>
//             </div>
//             <div>
//               <span className="dark:text-white">With Our Cutting-edge&nbsp;</span>
//               <span className="text-lemonGreen-light">Solutions</span>
//             </div>
//           </h1>

//           {/* Supporting Text */}
//           <p className="text-center text-gray-500 mt-4 max-w-xl mb-8 dark:text-gray-300 font-secondary">
//             LogaXP is your trusted partner for cutting-edge software products. Our team of IT engineers and developers is dedicated to crafting solutions that elevate your business and keep you above the competition.
//           </p>

//           {/* Call to Action */}
//           <div className="flex justify-center mt-6 mb-12 bg-gray-50 dark:bg-gray-800">
//             <Link
//               className="bg-lemonGreen-light text-white font-bold dark:text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
//               to={routes.allProducts}
//             >
//               Explore Our Services
//             </Link>
//           </div>
//         </ScaleOut>
//       </section>

//       {/* Banner Section */}
//       <section className="flex justify-center bg-gray-50 dark:bg-gray-800">
//         <img
//           alt="banner"
//           className="w-full md:w-3/4 h-auto rounded-lg dark:filter dark:brightness-75"
//           src={banner}
//         />
//       </section>

//       {/* Additional Info Section */}
//       <InfoSection title="Effective Solution" subtitle="for your business" />
//     </>
//   );
// };

// export default Hero;
