// ServiceDetail.tsx (Enhanced)
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from './servicesData';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const service = services.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 min-h-screen py-12">
      <section className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-4">{service.title}</h2>
          <p className="text-lg">{service.description}</p>
        </div>

        {/* Video (if available) */}
        {service.video && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <video
              className="w-full h-auto object-cover"
              src={service.video}
              controls
            ></video>
          </div>
        )}

        {/* Detailed Content */}
        <div className="mb-8">
          {/* Add more detailed content here */}
          <h3 className="text-2xl font-semibold mb-4">Detailed Overview</h3>
          <p className="mb-4">
            {/* Replace with actual detailed content */}
            Our {service.title} service offers comprehensive solutions to meet your business needs. We focus on delivering high-quality results that drive growth and efficiency.
          </p>
          <h3 className="text-2xl font-semibold mb-4">Key Features</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Feature One: Description of feature one.</li>
            <li>Feature Two: Description of feature two.</li>
            <li>Feature Three: Description of feature three.</li>
          </ul>
          <h3 className="text-2xl font-semibold mb-4">Benefits</h3>
          <ul className="list-disc list-inside">
            <li>Benefit One: Description of benefit one.</li>
            <li>Benefit Two: Description of benefit two.</li>
            <li>Benefit Three: Description of benefit three.</li>
          </ul>
        </div>

        {/* Return Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-lemonGreen-light hover:text-lemonGreen-dark transition-colors duration-300"
        >
          <FaArrowLeft size={20} className="mr-2" />
          Return
        </motion.button>
      </section>
    </div>
  );
};

export default ServiceDetail;
