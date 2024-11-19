import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogs } from '../../utils/blogs';
import routes from '../../routing/routes';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const blogId = id ? parseInt(id, 10) : undefined;
  const blog = blogs.find((b) => b.id === blogId);

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Blog post not found!</h1>
        <Link
          to={routes.blogsList}
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
      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
        <span className="bg-lemonGreen text-deepBlue px-3 py-1 rounded-full font-semibold mr-4">
          {blog.category}
        </span>
        <span>{`${blog.duration} mins read`}</span>
      </div>
      <img
        className="w-full h-64 object-cover rounded-lg my-6"
        src={blog.poster}
        alt={`${blog.title} Poster`}
      />
      <p className="text-gray-700 dark:text-gray-300 mb-8">{blog.summary}</p>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
        <p>
          {/* Detailed content placeholder */}
          This is a detailed article about {blog.title}. Add the full content of
          your article here.
        </p>
        {/* Additional paragraphs can be added here */}
      </div>
      <Link
        to={routes.blogsList}
        className="inline-block bg-lemonGreen text-deepBlue px-8 py-3 rounded-full mt-8 font-semibold hover:bg-green-600 transition-colors duration-200"
      >
        Browse All Posts
      </Link>
    </div>
  );
};

export default BlogDetail;
