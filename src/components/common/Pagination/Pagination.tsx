// src\components\common\Pagination\Pagination.tsx

import React from 'react';
import Button  from '../Button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="inline-flex -space-x-px border py-2 ">
      <Button
        variant="link"
        size="small"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={number === currentPage ? 'primary' : 'link'}
          size="small"
          onClick={() => onPageChange(number)}
          className="mx-1"
        >
          {number}
        </Button>
      ))}
      <Button
        variant="link"
        size="small"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
