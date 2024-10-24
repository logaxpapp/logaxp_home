// src/components/Blogs/Blog.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../routing/routes'; // Import routes

interface BlogProps {
  blog: {
    id: number;
    title: string;
    category: string;
    duration: number;
    poster: string;
    summary: string;
  };
}

const Blog: React.FC<BlogProps> = ({ blog }) => {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden">
      <img
        className="w-full h-48 object-cover"
        src={blog.poster}
        alt={`${blog.title} Poster`}
      />
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{blog.title}</h3>
        <span className="text-lemonGreen font-semibold">{blog.category}</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{`${blog.duration} mins read`}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.summary}</p>
        <Link
          to={routes.blogs(blog.id)} // Correctly generate the URL
          className="text-lemonGreen font-semibold hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Blog;
