// src/components/ComingSoon.tsx

import React, { useState } from 'react';
import { FaEnvelope, FaTwitter, FaFacebookF, FaLinkedinIn, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion'; // For animations
import ComingSoonImage from '../assets/images/coming-soon.png';

const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      // Simulate success response
      setStatus('success');
      setEmail('');
    }, 2000);
  };

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-4">
      {/* Content Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-start justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
            We're Launching Soon!
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Get ready for an amazing experience. Stay tuned for our official launch.
          </p>
        </motion.div>

        {/* Subscription Form */}
        <motion.form
          onSubmit={handleSubscribe}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-md flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden"
        >
          <FaEnvelope className="text-gray-400 dark:text-gray-300 mx-3" />
          <input
            type="email"
            aria-label="Email Address"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 flex items-center justify-center hover:bg-blue-700 transition-colors"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <span>Notify Me</span>
            )}
          </button>
        </motion.form>

        {/* Status Message */}
        {status === 'success' && (
          <motion.p
            className="mt-4 text-green-600 dark:text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Thank you! You'll be the first to know when we launch.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            className="mt-4 text-red-600 dark:text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Please enter a valid email address.
          </motion.p>
        )}

        {/* Social Media Links */}
        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
          >
            <FaLinkedinIn size={24} />
          </a>
        </motion.div>
      </div>

      {/* Image Section */}
      <motion.div
        className="w-full lg:w-1/2 mb-8 lg:mb-0 flex justify-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <img
          src={ComingSoonImage}
          alt="Coming Soon Illustration"
          className="rounded-lg shadow-lg object-cover w-full max-w-md"
        />
      </motion.div>
    </div>
  );
};

export default ComingSoon;
