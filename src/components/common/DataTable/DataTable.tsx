// src/components/common/DataTable/DataTable.tsx

import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  Cell?: ({ value }: { value: any }) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  onRowClick?: (item: T) => void;

  // Row Selection Props
  selectable?: boolean;
  selectedRowIds?: Set<string>;
  onRowSelect?: (selectedIds: Set<string>) => void;
}

function DataTable<T extends { _id: string }>({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selectable = false,
  selectedRowIds = new Set(),
  onRowSelect,
}: DataTableProps<T>) {
  const handleSort = (accessor: keyof T) => {
    if (onSort) {
      onSort(accessor);
    }
  };

  // Handle Select All Toggle
  const isAllSelected = data.length > 0 && selectedRowIds.size === data.length;

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(data.map(item => item._id));
      onRowSelect && onRowSelect(allIds);
    } else {
      onRowSelect && onRowSelect(new Set());
    }
  };

  return (
    <table className="min-w-full bg-white dark:bg-gray-800 dark:text-gray-50 mb-10 text-xs font-primary">
      <thead>
        <tr>
          {selectable && (
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-gray-600 tracking-wider font-secondary">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
          )}
          {columns.map((column, idx) => (
            <th
              key={idx}
              className={`px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider font-secondary ${
                column.sortable ? 'cursor-pointer select-none' : ''
              }`}
              onClick={() =>
                column.sortable &&
                typeof column.accessor === 'string' &&
                handleSort(column.accessor)
              }
            >
              <div className="flex items-center">
                {column.header}
                {column.sortable && typeof column.accessor === 'string' && sortColumn === column.accessor && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 font-secondary">
        {data.map((item) => (
          <tr
            key={item._id}
            className={`${
              onRowClick ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' : ''
            }`}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {selectable && (
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 font-secondary">
                <input
                  type="checkbox"
                  checked={selectedRowIds.has(item._id)}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent triggering row click
                    const newSelected = new Set(selectedRowIds);
                    if (e.target.checked) {
                      newSelected.add(item._id);
                    } else {
                      newSelected.delete(item._id);
                    }
                    onRowSelect && onRowSelect(newSelected);
                  }}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </td>
            )}
            {columns.map((column, colIdx) => {
              let cellContent: React.ReactNode;

              if (column.Cell) {
                // Custom rendering using the Cell function
                const value = typeof column.accessor === 'function' ? column.accessor(item) : item[column.accessor];
                cellContent = column.Cell({ value });
              } else if (typeof column.accessor === 'function') {
                // Use function accessor directly
                cellContent = column.accessor(item) || '';
              } else {
                // Access the item property by key, ensuring it's not a complex object
                const value = item[column.accessor];
                cellContent = typeof value === 'object' && value !== null ? JSON.stringify(value) : (value as React.ReactNode);
              }

              return (
                <td
                  key={colIdx}
                  className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 font-secondary"
                >
                  {cellContent}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;
