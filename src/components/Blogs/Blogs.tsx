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
      className="py-16 bg-gray-100 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-lemonGreen font-semibold uppercase tracking-wide">
            Blog
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Featured Posts
          </h2>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.slice(0, 3).map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>

        {/* Browse All Posts Button */}
        <div className="flex justify-center mt-12">
          <Link
            to={routes.allPosts}
            className="bg-lemonGreen text-deepBlue px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            Browse All Posts
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default Blogs;
