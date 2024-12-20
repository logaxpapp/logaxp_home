// src/components/OurBusiness/OurBusiness.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { services } from './servicesData'; // Updated import
import routes from '../../routing/routes'; // Import routes

const OurBusiness: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dark:bg-gray-800 py-12">
      <section className="container mx-auto px-4 py-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-100">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section (First Service with Video) */}
          {services[0].video && (
            <div className="lg:col-span-2">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                  src={services[0].video}
                  autoPlay
                  loop
                  muted
                  controls={false}
                ></video>
              </div>
            </div>
          )}

          {/* Service Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div>
                <h2 className="text-4xl font-bold text-lemonGreen-light">
                  {service.id}.
                </h2>
                <h3 className="text-3xl text-gray-900 dark:text-white font-extrabold mb-6">
                  {service.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 20 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mt-auto self-start"
                aria-label={`Learn more about ${service.title}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(routes.serviceDetail(service.id))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate(routes.serviceDetail(service.id));
                  }
                }}
              >
                <FaArrowRight
                  size={24}
                  className="text-lemonGreen-light cursor-pointer hover:text-lemonGreen-dark transition-colors duration-300"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OurBusiness;
