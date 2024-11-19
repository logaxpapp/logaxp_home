import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTwitter, FaFacebookF, FaInstagram, FaGithub, FaLinkedin,
} from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 py-1">
      {/* Newsletter Section */}
      <div className="bg-deepBlue-dark text-white dark:bg-deepBlue py-4 max-w-7xl mx-auto rounded">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h4 className="text-xl font-semibold">Newsletter</h4>
            <p>Be the first to know about discounts, offers, and events.</p>
          </div>
          <div className="flex space-x-4 items-center">
            <input
              type="email"
              placeholder="Enter Email Address"
              className="px-4 py-2 w-64 text-black rounded-lg focus:outline-none"
            />
            <button className="bg-lemonGreen hover:bg-green-600 text-deepBlue px-6 py-2 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-left">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-gray-700 dark:text-white">
              Loga<span className="text-lemonGreen-light">XP</span>
            </Link>
            <p className="text-sm pt-4 dark:text-gray-400">
              Stay updated with the latest news, tips, and exciting updates by following us on our social media platforms. Let's connect and share the journey together!
            </p>
            <p className="text-sm mt-4 dark:text-gray-400">
              1105 Berry Street, Old Hickory, Tennessee 37138
            </p>
            <div className="mt-4 flex space-x-4">
              <FaFacebookF className="text-gray-700 dark:text-gray-400 hover:text-lemonGreen" />
              <FaTwitter className="text-gray-700 dark:text-gray-400 hover:text-lemonGreen" />
              <FaInstagram className="text-gray-700 dark:text-gray-400 hover:text-lemonGreen" />
              <FaLinkedin className="text-gray-700 dark:text-gray-400 hover:text-lemonGreen" />
              <FaGithub className="text-gray-700 dark:text-gray-400 hover:text-lemonGreen" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold mb-4 text-lemonGreen">Products</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">DocSend</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">TimeSync</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">TaskBrick</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">Beautyhub</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">BookMiz</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">GatherPlx</Link></li>
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="font-bold mb-4 text-lemonGreen">Business Types</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">Blog</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">Food & Beverages</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">App Development</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">DevOps Consultancy</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">Security And Monitoring</Link></li>
              <li><Link to="/" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">Health & Fitness</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4 text-lemonGreen">Support</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-4">
              <li className="text-sm dark:text-gray-400">FAQ</li>
              <li><a href="tel:+16159306090" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">+1 (615) 554-3592</a></li>
              <li><a href="tel:+18329465563" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">+1 (832) 946-5563</a></li>
              <li><a href="tel:+2348031332801" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">+2348</a></li>
              <li><a href="mailto:enquiries@logaxp.com" className="hover:text-lemonGreen text-gray-700 dark:text-gray-400 text-sm">enquiries@logaxp.com</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-700 pt-6 flex flex-col lg:flex-row justify-between items-center text-xs lg:text-sm">
          <div className="mb-4 lg:mb-0 flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <Link to="/" className="text-2xl font-bold text-gray-700 dark:text-white">
              Loga<span className="text-lemonGreen-light">XP</span>
            </Link>
            <Link to="/legal" className="hover:text-gray-400 dark:hover:text-gray-500">Legal</Link>
            <Link to="/privacy-statement" className="hover:text-gray-400 dark:hover:text-gray-500">Privacy Policy</Link>
          </div>
          <div className="mt-4 lg:mt-0">
            <span className="text-gray-700 dark:text-gray-400">United States</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
