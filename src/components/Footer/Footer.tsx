// "I want the vital message at all time."
// src/components/Footer.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { useSubscribeMutation } from '../../api/newsletterApi';
import { useToast } from '../../features/Toast/ToastContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribe, { isLoading }] = useSubscribeMutation();
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter a valid email address.');
      return;
    }
    try {
      await subscribe({ email }).unwrap();
      showToast('Subscription successful! Please check your email to confirm.');
      setEmail('');
    } catch (err: any) {
      showToast(err.data?.message || 'Failed to subscribe. Please try again later.');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 font-primary">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-8 max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h4 className="text-xl font-semibold text-white mb-2">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-sm">
              Stay updated with the latest news, offers, and events.
            </p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:w-72 px-4 py-2 rounded-lg focus:outline-none text-gray-800"
              required
            />
            <button
              type="submit"
              className={`bg-lemonGreen text-white px-6 py-2 rounded-lg hover:bg-green-600 transition ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
              Loga<span className="text-lemonGreen">XP</span>
            </Link>
            <p className="text-sm mb-4">
              Your trusted partner for innovative IT solutions and business productivity.
            </p>
            <p className="text-sm">
              1108 Berry Street, Old Hickory, Tennessee 37138
            </p>
            <div className="flex mt-6 gap-4">
              {[
                { href: 'https://www.facebook.com', icon: <FaFacebookF /> },
                { href: 'https://www.twitter.com', icon: <FaTwitter /> },
                { href: 'https://www.instagram.com', icon: <FaInstagram /> },
                { href: 'https://www.linkedin.com', icon: <FaLinkedin /> },
                { href: 'https://www.github.com', icon: <FaGithub /> },
              ].map(({ href, icon }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-lemonGreen transition cursor-pointer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {[
                { name: 'DocSend', path: '/products/docsend' },
                { name: 'TimeSync', path: '/products/timesync' },
                { name: 'TaskBrick', path: '/products/taskbrick' },
                { name: 'Beautyhub', path: '/products/beautyhub' },
                { name: 'BookMiz', path: '/products/bookmiz' },
                { name: 'GatherPlx', path: '/products/gatherplx' },
              ].map(({ name, path }, index) => (
                <li key={index}>
                  <Link to={path} className="text-gray-400 hover:text-lemonGreen transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Business Types</h4>
            <ul className="space-y-2">
              {[
                { name: 'BeautyHub', path: '/about-beautyhub' },
                { name: 'Food & Beverages', path: '/beverages' },
                { name: 'App Development', path: '/app-development' },
                { name: 'DevOps Consultancy', path: '/devops' },
                { name: 'Security & Monitoring', path: '/security' },
                { name: 'Health & Fitness', path: '/health-fitness' },
              ].map(({ name, path }, index) => (
                <li key={index}>
                  <Link to={path} className="text-gray-400 hover:text-lemonGreen transition">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-lemonGreen transition">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="tel:+16155543592" className="text-gray-400 hover:text-lemonGreen transition">
                  +1 (615) 554-3592
                </a>
              </li>
              <li>
                <a href="mailto:enquiries@logaxp.com" className="text-gray-400 hover:text-lemonGreen transition">
                  enquiries@logaxp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-12 py-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
          <p className="text-center md:text-left text-gray-400">
            &copy; {new Date().getFullYear()} LogaXP. All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/legal" className="text-gray-400 hover:text-lemonGreen transition">
              Legal
            </Link>
            <Link to="/privacy-statement" className="text-gray-400 hover:text-lemonGreen transition">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
