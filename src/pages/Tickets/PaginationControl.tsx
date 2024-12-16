// src/components/Pagination/PaginationControl.tsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const renderPageNumbers = () => {
    const pages = [];

    // For simplicity, show first, current, and last pages with ellipsis
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 rounded-md ${
              i === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded-md ${
                i === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i}
            </button>
          );
        }
        pages.push(<span key="ellipsis1">...</span>);
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md ${
              totalPages === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {totalPages}
          </button>
        );
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md ${
              1 === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            1
          </button>
        );
        pages.push(<span key="ellipsis2">...</span>);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(
            <button
              key={i}
              onClick={() => onPageChange(i)}
              className={`px-3 py-1 rounded-md ${
                i === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i}
            </button>
          );
        }
      } else {
        pages.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-md ${
              1 === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            1
          </button>
        );
        pages.push(<span key="ellipsis3">...</span>);
        pages.push(
          <button
            key={currentPage - 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`px-3 py-1 rounded-md ${
              (currentPage - 1) === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentPage - 1}
          </button>
        );
        pages.push(
          <button
            key={currentPage}
            onClick={() => onPageChange(currentPage)}
            className={`px-3 py-1 rounded-md ${
              currentPage === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentPage}
          </button>
        );
        pages.push(
          <button
            key={currentPage + 1}
            onClick={() => onPageChange(currentPage + 1)}
            className={`px-3 py-1 rounded-md ${
              (currentPage + 1) === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {currentPage + 1}
          </button>
        );
        pages.push(<span key="ellipsis4">...</span>);
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className={`px-3 py-1 rounded-md ${
              totalPages === currentPage
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {totalPages}
          </button>
        );
      }
    }

    return pages; // **Ensure the pages array is returned**
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <FaChevronLeft />
      </button>
      {renderPageNumbers()}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginationControl;
