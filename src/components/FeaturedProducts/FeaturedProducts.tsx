// src/components/FeaturedProducts.tsx

import React from 'react';
import { motion } from 'framer-motion';
import Site from './Site';
import { Link } from 'react-router-dom';
import routes from '../../routing/routes';
import { featuredSites } from './featuredSites';

const FeaturedProducts: React.FC = () => {
  // Select only the first three products for featured display
  const featured = featuredSites.slice(0, 3);

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <span className="text-lemonGreen font-extrabold text-3xl">Our Products</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4 dark:text-white text-center">
            Featured Products
          </h2>
          <p className="text-gray-500 dark:text-gray-100 mt-2 max-w-lg mx-auto">
            Explore our range of products, and stay tuned, as we have more exciting apps in the pipeline, ready to reshape your world.
          </p>
        </motion.div>

        {/* Featured Products List */}
        <div className="flex flex-col gap-8">
          {featured.map((site, index) => (
            <Site key={index} product={site} index={index} />
          ))}
        </div>

        {/* View All Products Button */}
        <div className="flex justify-center mt-8">
          <Link
            to={routes.allProducts}
            className=" bg-lemonGreen text-white font-extrabold border border-lemonGreen px-6 py-3 rounded-lg hover:bg-lemonGreen-light hover:text-white transition-colors duration-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
