import React from 'react';

export interface Column<T> {
  id: string;
  label: string;
  renderCell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: boolean;
  onRowClick?: (row: T) => void;
}

type Order = 'asc' | 'desc';

function descendingComparator<T extends Record<string, unknown>>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T extends Record<string, unknown>>(order: Order, orderBy: keyof T) {
  return order === 'desc'
    ? (a: T, b: T) => descendingComparator(a, b, orderBy)
    : (a: T, b: T) => -descendingComparator(a, b, orderBy);
}

const DataTable = <T extends { _id: string }>({
  columns,
  data,
  pagination = false,
  onRowClick,
}: DataTableProps<T>) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columns[0].id);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = React.useMemo(() => {
    return data.slice().sort(getComparator(order, orderBy as keyof T));
  }, [data, order, orderBy]);

  const paginatedData = React.useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-gray-50 font-primary">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-2 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleRequestSort(column.id)}
              >
                <div className="flex items-center">
                  {column.label}
                  <svg
                    className={`ml-1 h-4 w-4 transform transition-transform ${
                      orderBy === column.id
                        ? order === 'asc'
                          ? 'rotate-0'
                          : 'rotate-180'
                        : 'rotate-0'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-200 font-secondary">
          {paginatedData.map((row) => (
            <tr
              key={row._id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className="px-2 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-700"
                >
                  {column.renderCell ? column.renderCell(row) : (row as any)[column.id] ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}

          {paginatedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-xs md:text-sm text-gray-500"
              >
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between py-3 space-y-3 md:space-y-0 font-secondary">
          {/* Rows Per Page */}
          <div className="flex items-center space-x-2">
            <label htmlFor="rows-per-page" className="text-xs md:text-sm text-gray-700">
              Rows per page:
            </label>
            <select
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="block w-full md:w-auto pl-3 pr-10 py-2 text-xs md:text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
            >
              <option>5</option>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          {/* Page Navigation */}
          <div className="flex space-x-3">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className={`px-3 py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md ${
                page === 0
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= Math.ceil(data.length / rowsPerPage) - 1}
              className={`px-3 py-2 border border-gray-300 text-xs md:text-sm font-medium rounded-md ${
                page >= Math.ceil(data.length / rowsPerPage) - 1
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
