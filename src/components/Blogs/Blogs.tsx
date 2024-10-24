// src/components/Blogs/Blogs.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Blog from './Blog';
import routes from '../../routing/routes';
import { blogs } from '../../utils/blogs';

const Blogs: React.FC = () => {
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
            Featured Posts
          </h2>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => ( // Display only the first three blogs
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Browse All Posts Button */}
        <div className="flex justify-center mt-8">
          <Link
            to={routes.allPosts} // Navigate to AllPosts component
            className="bg-lemonGreen text-deepBlue px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Browse All Posts
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default Blogs;
