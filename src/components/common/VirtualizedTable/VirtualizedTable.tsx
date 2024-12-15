// src/components/common/VirtualizedTable/VirtualizedTable.tsx

import React, { useRef, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualizedTableProps<T extends { _id: string }> {
  columns: ColumnDef<T, any>[];
  data: T[];
  onRowClick?: (row: T) => void;
}

function VirtualizedTable<T extends { _id: string }>({
  columns,
  data,
  onRowClick,
}: VirtualizedTableProps<T>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Add other table options here if needed
  });

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 50, // Row height
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div ref={tableContainerRef} className="h-96 overflow-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 font-secondary">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider font-secondary ${
                    header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                  }`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center dark:text-gray-50">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: '▲',
                      desc: '▼',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          <tr style={{ height: `${paddingTop}px` }}>
            <td colSpan={columns.length} />
          </tr>
          {virtualRows.map(virtualRow => {
            const row = table.getRowModel().rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                className={`${
                  onRowClick ? 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row.original)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 font-secondary"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr style={{ height: `${paddingBottom}px` }}>
            <td colSpan={columns.length} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default VirtualizedTable;
