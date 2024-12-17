import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAngleDown, FaAngleUp, FaSearch } from 'react-icons/fa';
import { Tab } from '@headlessui/react';

const faqData = [
  {
    category: 'DocSend',
    questions: [
      { id: 1, question: 'What is DocSend?', answer: 'DocSend is a secure document sharing platform that allows users to track and manage document access.' },
      { id: 2, question: 'How secure is DocSend?', answer: 'DocSend uses enterprise-grade security with encryption and access controls.' },
      { id: 3, question: 'Can I revoke access to shared documents?', answer: 'Yes, DocSend allows users to revoke access to shared documents at any time.' },
      { id: 4, question: 'What are the security measures in place for DocSend?', answer: 'DocSend has implemented strong security measures, including two-factor authentication, secure connections, and encryption.' },
      { id: 5, question: "What is the data protection regulation in place for DocSend?', answer: 'DocSend is compliant with the General Data Protection Regulation (GDPR) and the European Union's General Data Protection Regulation (EU GDPR)." },  
      { id: 6, question: 'What are the data retention policies in place for DocSend?', answer: 'DocSend has implemented strong data retention policies, including data anonymization, secure deletion, and compliance with legal requirements.' },
    ],
  },
  {
    category: 'TimeSync',
    questions: [
      { id: 1, question: 'What is TimeSync?', answer: 'TimeSync is a scheduling and time management tool for businesses and individuals.' },
      { id: 2, question: 'Can I integrate TimeSync with other calendars?', answer: 'Yes, TimeSync integrates with Google Calendar, Outlook, and Apple Calendar.' },
      { id: 3, question: 'What are the security measures in place for TimeSync?', answer: 'TimeSync has implemented strong security measures, including two-factor authentication, secure connections, and encryption.' },
      { id: 4, question: "What are the data protection regulation in place for TimeSync?', answer: 'TimeSync is compliant with the General Data Protection Regulation (GDPR) and the European Union's General Data Protection Regulation (EU GDPR)." },  
      { id: 5, question: "What are the data retention policies in place for TimeSync?', answer: 'TimeSync has implemented strong data retention policies, including data anonymization, secure deletion, and compliance with legal requirements." },
    ],
  },
  {
    category: 'TaskBrick',
    questions: [
      { id: 1, question: 'What is TaskBrick?', answer: 'TaskBrick is a project management tool designed for team collaboration and task tracking.' },
      { id: 2, question: 'Does TaskBrick support Gantt charts?', answer: 'Yes, TaskBrick includes Gantt charts and Kanban boards.' },
    ],
  },
  {
    category: 'Beautyhub',
    questions: [
      { id: 1, question: 'What is Beautyhub?', answer: 'Beautyhub is an all-in-one platform for beauty professionals to manage bookings and clients.' },
      { id: 2, question: 'Can I accept payments through Beautyhub?', answer: 'Yes, Beautyhub integrates with Stripe and PayPal for seamless payments.' },
    ],
  },
  {
    category: 'BookMiz',
    questions: [
      { id: 1, question: 'What is BookMiz?', answer: 'BookMiz is a booking system for businesses to manage appointments and reservations.' },
      { id: 2, question: 'How does BookMiz handle cancellations?', answer: 'BookMiz allows businesses to configure flexible or strict cancellation policies.' },
    ],
  },
  {
    category: 'GatherPlx',
    questions: [
      { id: 1, question: 'What is GatherPlx?', answer: 'GatherPlx is an event management platform that simplifies event planning and ticketing.' },
      { id: 2, question: 'Does GatherPlx support virtual events?', answer: 'Yes, GatherPlx supports both in-person and virtual events.' },
    ],
  },
];

const QUESTIONS_PER_PAGE = 20;

const FAQ: React.FC = () => {
  const [activeIds, setActiveIds] = useState<{ [key: number]: number | null }>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentTab, setCurrentTab] = useState(0);
  const [currentPages, setCurrentPages] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    // Initialize currentPages for all categories
    const initialPages: { [key: number]: number } = {};
    faqData.forEach((_, idx) => {
      initialPages[idx] = 0;
    });
    setCurrentPages(initialPages);
  }, []);

  useEffect(() => {
    // Reset active accordion and current page when tab changes
    setActiveIds((prev) => ({
      ...prev,
      [currentTab]: null,
    }));
    setCurrentPages((prev) => ({
      ...prev,
      [currentTab]: 0,
    }));
  }, [currentTab]);

  useEffect(() => {
    // Reset current page when search query changes
    setCurrentPages((prev) => ({
      ...prev,
      [currentTab]: 0,
    }));
  }, [searchQuery, currentTab]);

  const toggleAccordion = (categoryIdx: number, faqId: number) => {
    setActiveIds((prev) => ({
      ...prev,
      [categoryIdx]: prev[categoryIdx] === faqId ? null : faqId,
    }));
  };

  const handlePreviousPage = (categoryIdx: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [categoryIdx]: Math.max(prev[categoryIdx] - 1, 0),
    }));
  };

  const handleNextPage = (categoryIdx: number) => {
    setCurrentPages((prev) => ({
      ...prev,
      [categoryIdx]: prev[categoryIdx] + 1,
    }));
  };

  return (
    <div className="bg-white min-h-screen py-12 px-6 md:px-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h1 className="text-lg md:text-5xl font-extrabold text-blue-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore FAQs for our suite of powerful SaaS products. Find answers to your most common questions.
        </p>
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

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
        <Tab.List className="flex justify-center flex-wrap space-x-4 mb-10">
          {faqData.map((category, idx) => (
            <Tab
              key={idx}
              className={({ selected }) =>
                `px-4 py-2 font-medium text-sm rounded-full transition-all mb-2 ${
                  selected ? 'bg-lemonGreen-light text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`
              }
            >
              {category.category}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {faqData.map((category, idx) => {
            const filteredQuestions = category.questions.filter((faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
            const currentPage = currentPages[idx] || 0;

            const paginatedQuestions = filteredQuestions.slice(
              currentPage * QUESTIONS_PER_PAGE,
              (currentPage + 1) * QUESTIONS_PER_PAGE
            );

            return (
              <Tab.Panel key={idx}>
                {/* Questions */}
                <div className="space-y-6">
                  {paginatedQuestions.length > 0 ? (
                    paginatedQuestions.map((faq) => (
                      <motion.div
                        key={faq.id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={() => toggleAccordion(idx, faq.id)}
                          className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-700 hover:bg-blue-50 transition-all"
                          aria-expanded={activeIds[idx] === faq.id}
                          aria-controls={`faq-panel-${idx}-${faq.id}`}
                          id={`faq-button-${idx}-${faq.id}`}
                        >
                          <span className="font-semibold text-[14px]">{faq.question}</span>
                          <motion.span
                            animate={{ rotate: activeIds[idx] === faq.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {activeIds[idx] === faq.id ? (
                              <FaAngleUp className="text-blue-600" />
                            ) : (
                              <FaAngleDown className="text-blue-600" />
                            )}
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {activeIds[idx] === faq.id && (
                            <motion.div
                              id={`faq-panel-${idx}-${faq.id}`}
                              role="region"
                              aria-labelledby={`faq-button-${idx}-${faq.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="px-6 py-4 text-gray-600 bg-gray-50 text-sm"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No matching questions found.</p>
                  )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-4">
                    <button
                      onClick={() => handlePreviousPage(idx)}
                      disabled={currentPage === 0}
                      className={`px-4 py-2 rounded ${
                        currentPage === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() => handleNextPage(idx)}
                      disabled={(currentPage + 1) * QUESTIONS_PER_PAGE >= filteredQuestions.length}
                      className={`px-4 py-2 rounded ${
                        (currentPage + 1) * QUESTIONS_PER_PAGE >= filteredQuestions.length
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default FAQ;