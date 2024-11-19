import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../routing/routes';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative">
        <img
          className="w-full h-56 object-cover"
          src={blog.poster}
          alt={`${blog.title} Poster`}
        />
        <div className="absolute top-4 left-4 bg-lemonGreen text-deepBlue px-3 py-1 rounded-full text-sm font-semibold">
          {blog.category}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{blog.title}</h3>
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <span>{`${blog.duration} mins read`}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{blog.summary}</p>
        <Link
          to={routes.blogs(blog.id)}
          className="inline-flex items-center text-lemonGreen font-semibold hover:underline"
        >
          Read More
          <svg
            className="ml-2 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M12.293 5.293a1 1 0 011.414 0L17 8.586V7a1 1 0 112 0v6a1 1 0 11-2 0v-1.586l-3.293 3.293a1 1 0 01-1.414-1.414L14.586 12H7a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Blog;
