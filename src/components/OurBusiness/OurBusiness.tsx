// src/components/OurBusiness.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa'; // Importing the arrow icon
import { useNavigate } from 'react-router-dom'; // For navigation if using React Router
import Card from '../common/UI/Card';
import FlexBox from '../common/Layout/FlexBox/FlexBox';

const services = [
  {
    id: '01',
    title: 'Event Search Optimization',
    description:
      'Increase your visibility on search engines and attract more customers with our specialized Event Search Optimization services.',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video URL
  },
  {
    id: '02',
    title: 'Booking Management',
    description:
      'Streamline your booking process, reduce no-shows, and enhance customer satisfaction with our comprehensive Booking Management solutions.',
  },
  {
    id: '03',
    title: 'HR Simplicity',
    description:
      'Reduce employee turnover, improve satisfaction, and increase retention with our HR Simplification services tailored to your business needs.',
  },
  {
    id: '04',
    title: 'Data Tracking',
    description:
      'Identify areas for improvement and optimize your website’s search engine visibility through regular data tracking and analysis.',
  },
];

const OurBusiness: React.FC = () => {
  const navigate = useNavigate(); 

  return (
    <div className="dark:bg-gray-800 py-2">
    <section className="container mx-auto px-4 py-4 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Header Section */}
      <div className="text-center mb-10">
        <p className="text-2xl font-semibold text-lemonGreen-light">
          Why LogaXP?
        </p>
        <h2 className="mt-2 text-4xl font-bold">
          The Benefits We Offer to Our Customers
        </h2>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Discover how our specialized services can transform your business operations and drive growth.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <div className="relative pb-[35.25%] h-0 overflow-hidden rounded-lg shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={services[0].video}
              title="Service Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* First Service Card */}
        <div>
          <Card className="p-6 rounded-lg h-full">
            <FlexBox
              direction="column"
              gap={4}
              className="h-full flex flex-col"
            >
              <div>
                <h2 className="text-4xl font-bold text-lemonGreen-light">
                  {services[0].id}.
                </h2>
                <h3 className="text-3xl text-gray-900 dark:text-white font-extrabold mb-8">
                  {services[0].title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {services[0].description}
                </p>
              </div>
              {/* Animated Arrow */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mt-auto self-start"
                aria-label={`Learn more about ${services[0].title}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/services/${services[0].id}`)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(`/services/${services[0].id}`);
                  }
                }}
              >
                <FaArrowRight
                  size={24}
                  className="text-lemonGreen-light cursor-pointer hover:text-lemonGreen-dark transition-colors duration-300"
                />
              </motion.div>
            </FlexBox>
          </Card>
        </div>

        {/* Remaining Service Cards */}
        {services.slice(1).map((service) => (
          <div key={service.id}>
            <Card className="p-6 rounded-lg h-full">
              <FlexBox
                direction="column"
                gap={4}
                className="h-full flex flex-col"
              >
                <div>
                  <h2 className="text-4xl font-bold text-lemonGreen-light">
                    {service.id}.
                  </h2>
                  <h3 className="text-3xl text-gray-900 dark:text-white font-extrabold mb-8">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    {service.description}
                  </p>
                </div>
                {/* Animated Arrow */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 20 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="mt-auto self-start"
                  aria-label={`Learn more about ${service.title}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/services/${service.id}`)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/services/${service.id}`);
                    }
                  }}
                >
                  <FaArrowRight
                    size={24}
                    className="text-lemonGreen-light cursor-pointer hover:text-lemonGreen-dark transition-colors duration-300"
                  />
                </motion.div>
              </FlexBox>
            </Card>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
};

export default OurBusiness;
