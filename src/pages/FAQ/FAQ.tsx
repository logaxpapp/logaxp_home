import React, { useState } from 'react';
import {
  useGetPublishedFAQsQuery,
} from '../../api/faqApi';
import Pagination from '../../components/common/Pagination/Pagination';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const applications = [
  'DocSend',
  'TimeSync',
  'TaskBrick',
  'Beautyhub',
  'BookMiz',
  'GatherPlux',
];

const FAQ: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentApplication, setCurrentApplication] = useState(applications[0]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const { data: publishedFAQs, isLoading, error } = useGetPublishedFAQsQuery({
    application: currentApplication,
    page: currentPage,
    limit: 10,
  });

  const faqs = publishedFAQs?.data || [];
  const totalItems = publishedFAQs?.total || 0;
  const pageSize = 10;
  const totalPages = Math.ceil(totalItems / pageSize);

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (faqId: string) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  return (
    <div className="bg-white min-h-screen py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-lg md:text-3xl font-extrabold text-blue-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-600 max-w-3xl mx-auto">
          Browse our published FAQs and find the answers you need.
        </p>
      </div>

      {/* Application Tabs */}
      <div className="flex justify-center mb-6 space-x-4">
        {applications.map((app) => (
          <button
            key={app}
            onClick={() => setCurrentApplication(app)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md ${
              currentApplication === app
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-blue-200'
            }`}
          >
            {app}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading FAQs...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading FAQs. Please try again later.</p>
        ) : filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <div key={faq._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq._id)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-blue-50 transition-all"
              >
                <span className="font-semibold">{faq.question}</span>
                <span>
                  {openFaqId === faq._id ? (
                    <FaChevronUp className="text-blue-600" />
                  ) : (
                    <FaChevronDown className="text-blue-600" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openFaqId === faq._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 text-gray-600 bg-gray-100 text-sm"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No FAQs found matching your query.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default FAQ;