// src/components/Blogs/BlogDetail.tsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogs } from '../../utils/blogs';
import routes from '../../routes/routes'; // Import routes

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id?: string; }>(); // Extract 'id' from URL
  const blogId = id ? parseInt(id, 10) : undefined; // Convert 'id' to number
  const blog = blogs.find((b) => b.id === blogId); // Find the corresponding blog

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog post not found!</h1>
        <Link
          to={routes.blogsList} // Link back to the Blogs listing
          className="inline-block bg-lemonGreen text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      <span className="text-lemonGreen font-semibold">{blog.category}</span>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{`${blog.duration} mins read`}</p>
      <img
        className="w-full h-64 object-cover rounded-lg my-4"
        src={blog.poster}
        alt={`${blog.title} Poster`}
      />
      <p className="text-gray-600 dark:text-gray-300 mb-4">{blog.summary}</p>
      <div className="text-gray-600 dark:text-gray-300">
        <p>
          {/* Detailed content placeholder */}
          This is a detailed article about {blog.title}. Add the full content of your article here.
        </p>
      </div>
      <Link
        to={routes.blogsList} // Link back to the Blogs listing
        className="inline-block bg-lemonGreen text-deepBlue px-6 py-3 rounded-lg mt-4 hover:bg-green-600 transition-colors duration-200"
      >
        Browse All Posts
      </Link>
    </div>
  );
};

export default BlogDetail;
