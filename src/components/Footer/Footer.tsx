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
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full md:w-72 px-4 py-2 rounded-lg focus:outline-none text-gray-800"
            />
            <button className="bg-lemonGreen text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              Subscribe
            </button>
          </div>
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
              <FaFacebookF className="text-gray-400 hover:text-lemonGreen transition cursor-pointer" />
              <FaTwitter className="text-gray-400 hover:text-lemonGreen transition cursor-pointer" />
              <FaInstagram className="text-gray-400 hover:text-lemonGreen transition cursor-pointer" />
              <FaLinkedin className="text-gray-400 hover:text-lemonGreen transition cursor-pointer" />
              <FaGithub className="text-gray-400 hover:text-lemonGreen transition cursor-pointer" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {['DocSend', 'TimeSync', 'TaskBrick', 'Beautyhub', 'BookMiz', 'GatherPlx'].map(
                (product, index) => (
                  <li key={index}>
                    <Link
                      to="/"
                      className="text-gray-400 hover:text-lemonGreen transition"
                    >
                      {product}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Business Types</h4>
            <ul className="space-y-2">
              {[
                'Blog',
                'Food & Beverages',
                'App Development',
                'DevOps Consultancy',
                'Security And Monitoring',
                'Health & Fitness',
              ].map((type, index) => (
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
            <ul className="space-y-2">
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
