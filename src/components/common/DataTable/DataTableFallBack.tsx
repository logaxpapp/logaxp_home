// src/components/common/DataTable/DataTable.tsx

import React from 'react';
import classNames from 'classnames';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  Cell?: ({ value }: { value: any }) => JSX.Element; // Custom cell renderer
  className?: string; // Optional className for custom styling
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortColumn?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  onRowClick?: (item: T) => void;
  className?: string; // Optional className for the table
}
function DataTable<T>({
  data,
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const handleSort = (accessor: keyof T) => {
    if (onSort) {
      onSort(accessor);
    }
  };

  return (
    <table
      className={classNames(
        'min-w-full bg-white text-gray-700 dark:text-gray-50 dark:bg-gray-800 font-secondary overflow-auto mb-6',
        className
      )}
    >
      <thead>
        <tr>
          {columns.map((column, idx) => (
            <th
              key={idx}
              className={classNames(
                'px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider font-secondary',
                {
                  'cursor-pointer select-none': column.sortable,
                },
                column.className // Apply custom className
              )}
              onClick={() =>
                column.sortable &&
                typeof column.accessor === 'string' &&
                handleSort(column.accessor)
              }
            >
              <div className="flex items-center dark:text-gray-50">
                {column.header}
                {column.sortable &&
                  typeof column.accessor === 'string' &&
                  sortColumn === column.accessor && (
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
        {data.map((item, idx) => (
          <tr
            key={idx}
            className={classNames({
              'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer':
                onRowClick,
            })}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {columns.map((column, colIdx) => {
              let cellContent: React.ReactNode;

              if (column.Cell) {
                // Pass the entire item for custom rendering if needed
                cellContent = column.Cell({ value: item });
              } else if (typeof column.accessor === 'function') {
                cellContent = column.accessor(item);
              } else {
                const value = item[column.accessor];
                cellContent =
                  value !== undefined && value !== null ? String(value) : '';
              }

              return (
                <td
                  key={colIdx}
                  className={classNames(
                    'px-6 py-4 whitespace-no-wrap border-b border-gray-500 font-secondary',
                    column.className // Apply custom className
                  )}
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
