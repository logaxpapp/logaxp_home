// src/components/Pagination/Pagination.tsx

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  // Simple pagination logic: show all pages if totalPages <= 5, else show current, first, last, and neighbors
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage, '...', totalPages);
    }
  }

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Previous Page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
            page === currentPage
              ? 'bg-teal-700 text-white'
              : page === '...'
                ? 'bg-gray-300 cursor-default'
                : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
          aria-label={`Page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
