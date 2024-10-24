import React from 'react';
import { motion } from 'framer-motion';
import Site from './Site';
import { Link } from 'react-router-dom';
import routes from '../../routing/routes';
import { featuredSites } from './featuredSites'; // Ensure this path is correct

const AllProducts: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="mb-8 text-center"
        >
          <span className="text-lemonGreen font-semibold dark:text-white text-2xl"> </span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 dark:text-white">
          Our Range of Products
          </h2>
          <p className="text-gray-500  mt-2 max-w-lg mx-auto dark:text-gray-300">
            Discover our complete range of products designed to enhance your productivity and streamline your workflows.
          </p>
        </motion.div>

        {/* All Products List */}
        <div className="flex flex-col gap-8">
          {featuredSites.map((site, index) => (
            <Site key={index} product={site} index={index} />
          ))}
        </div>

        {/* Back to Featured Products Button */}
        <div className="flex justify-center mt-8">
          <Link
            to={routes.home} // Assuming 'home' is the route for the featured products
            className="bg-lemonGreen text-white border border-lemonGreen px-6 py-3 rounded-lg hover:bg-white hover:text-lemonGreen transition-colors duration-200"
          >
            Back to Featured Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
