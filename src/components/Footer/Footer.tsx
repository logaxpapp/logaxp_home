import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300  py-8">
      {/* Newsletter Section */}
      <div className="bg-gray-800 text-white py-6 max-w-7xl mx-auto">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between px-4 md:px-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h4 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h4>
            <p className="text-sm text-gray-400">
              Stay updated with the latest news, offers, and events.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-full sm:w-64 text-black rounded focus:outline-none"
            />
            <button className="bg-lemonGreen text-white px-6 py-2 rounded hover:bg-green-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-gray-500 mb-4 inline-block">
              Loga<span className="text-lemonGreen-light">XP</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner for innovative IT solutions and business productivity.
            </p>
            <p className="text-sm text-gray-400">
              1105 Berry Street, Old Hickory, Tennessee 37138
            </p>
            <div className="flex mt-4 gap-4">
              <FaFacebookF className="text-gray-400 hover:text-lemonGreen cursor-pointer" />
              <FaTwitter className="text-gray-400 hover:text-lemonGreen cursor-pointer" />
              <FaInstagram className="text-gray-400 hover:text-lemonGreen cursor-pointer" />
              <FaLinkedin className="text-gray-400 hover:text-lemonGreen cursor-pointer" />
              <FaGithub className="text-gray-400 hover:text-lemonGreen cursor-pointer" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2 text-sm">
              {['DocSend', 'TimeSync', 'TaskBrick', 'Beautyhub', 'BookMiz', 'GatherPlx'].map((product, index) => (
                <li key={index}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-lemonGreen transition"
                  >
                    {product}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Business Types</h4>
            <ul className="space-y-2 text-sm">
              {['Blog', 'Food & Beverages', 'App Development', 'DevOps Consultancy', 'Security And Monitoring', 'Health & Fitness'].map((type, index) => (
                <li key={index}>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-lemonGreen transition"
                  >
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-lemonGreen transition">
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="tel:+16155543592"
                  className="text-gray-400 hover:text-lemonGreen transition"
                >
                  +1 (615) 554-3592
                </a>
              </li>
              <li>
                <a
                  href="tel:+18329465563"
                  className="text-gray-400 hover:text-lemonGreen transition"
                >
                  +1 (832) 946-5563
                </a>
              </li>
              <li>
                <a
                  href="mailto:enquiries@logaxp.com"
                  className="text-gray-400 hover:text-lemonGreen transition"
                >
                  enquiries@logaxp.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700 mt-8 py-4">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-sm">
          <div className="text-center md:text-left text-gray-400">
            &copy; {new Date().getFullYear()} LogaXP. All Rights Reserved.
          </div>
          <div className="flex mt-4 md:mt-0 space-x-4">
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
