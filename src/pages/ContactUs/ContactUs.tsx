import React from 'react';
import banner from '../../assets/images/contactus.png';
import contactUs from '../../assets/images/contact-banner.jpg';

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex flex-col items-center ">
      {/* Banner Section */}
      <div className="relative w-full h-96 mb-10">
        <img
          src={banner}
          alt="Contact Banner"
          className="w-full h-full object-cover rounded-lg shadow"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold font-primary">Contact Us</h1>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-700 rounded-lg shadow-lg max-w-6xl w-full p-8 md:space-x-12">
        {/* Form Section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Contact Form</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 font-secondary">
            Have any questions or concerns about our products or how to leverage LogaXP for your
            business? Send us a message using the form below.
          </p>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 font-semibold"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-300 font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-gray-700 dark:text-gray-300 font-semibold"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen"
                placeholder="Subject"
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-gray-700 dark:text-gray-300 font-semibold"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lemonGreen"
                placeholder="Your Message"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-lemonGreen text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-600 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={contactUs}
            alt="Contact Us"
            className="rounded-lg shadow-lg object-cover h-full"
          />
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="mt-16 max-w-7xl mx-auto text-gray-700 dark:text-gray-300 px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Email Card */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg transition-transform hover:scale-105">
            <h4 className="text-xl font-bold text-blue-900 dark:text-lemonGreen">Email</h4>
            <p className="text-center mt-2">support@logaxp.com</p>
          </div>

          {/* Live Chat Card */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg transition-transform hover:scale-105">
            <h4 className="text-xl font-bold text-blue-900 dark:text-lemonGreen">Live Chat</h4>
            <p className="text-center mt-2">1108 Berry Street, Old Hickory, Tennessee 37138</p>
          </div>

          {/* Phone Card */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg transition-transform hover:scale-105">
            <h4 className="text-xl font-bold text-blue-900 dark:text-lemonGreen">Phone</h4>
            <p className="text-center mt-2">+1 (615) 554-3592</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
