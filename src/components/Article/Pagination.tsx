// src/components/common/Pagination/Pagination.tsx

import React from 'react';
import { Pagination as AntdPagination } from 'antd';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  return (
    <AntdPagination
      current={currentPage}
      total={totalItems}
      pageSize={pageSize}
      onChange={(page: number) => onPageChange(page)}
    />
  );
};

export default Pagination;
