// src/components/Blogs/AllPosts.tsx

import React from 'react';
import { motion } from 'framer-motion';
import Blog from './Blog';
import { blogs } from '../../utils/blogs';
import routes from '../../routes/routes';
import { Link } from 'react-router-dom';

const AllPosts: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-12 bg-gray-100 dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <span className="text-lemonGreen font-semibold">Blog</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            All Posts
          </h2>
        </div>

        {/* All Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-8">
          <Link
            to={routes.home} // Navigate back to Home component
            className="bg-lemonGreen text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default AllPosts;
