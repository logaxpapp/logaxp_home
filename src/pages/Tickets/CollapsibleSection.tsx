import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaInfoCircle } from 'react-icons/fa';

interface CollapsibleSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, description, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionId = `collapsible-section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="mb-6 border rounded-lg shadow-sm overflow-hidden">
      <button
        type="button"
        className="w-full flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={sectionId}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</span>
          {description && (
            <span className="text-gray-500 dark:text-gray-400" title={description}>
              <FaInfoCircle />
            </span>
          )}
        </div>
        {isOpen ? (
          <FaChevronUp className="text-gray-600 dark:text-gray-300" />
        ) : (
          <FaChevronDown className="text-gray-600 dark:text-gray-300" />
        )}
      </button>
      <div
        id={sectionId}
        className={`transition-max-height duration-300 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        } overflow-hidden`}
      >
        <div className="p-4 bg-white dark:bg-gray-800 text-xs">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
