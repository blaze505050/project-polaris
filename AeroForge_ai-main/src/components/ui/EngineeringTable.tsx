import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Download,
  Filter,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  accessor: (row: T) => any;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  unit?: string;
}

interface EngineeringTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  title?: string;
  description?: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  exportFilename?: string;
}

export default function EngineeringTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  description,
  pageSize = 10,
  onRowClick,
  exportFilename = 'aeroforge-data-export',
}: EngineeringTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterQuery, setFilterQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );
  const [showColPicker, setShowColPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortKey(null);
        setSortDirection('asc');
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter
  const filteredData = data.filter((row) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return columns.some((col) => {
      const val = col.accessor(row);
      return val !== null && val !== undefined && String(val).toLowerCase().includes(q);
    });
  });

  // Sorted data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return 0;

    const valA = col.accessor(a);
    const valB = col.accessor(b);

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    const cmp = valA < valB ? -1 : 1;
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Export CSV
  const handleExportCSV = () => {
    const activeCols = columns.filter((c) => visibleColumns.has(c.key));
    const headers = activeCols.map((c) => `"${c.header}${c.unit ? ` (${c.unit})` : ''}"`).join(',');
    const rows = sortedData.map((row) =>
      activeCols.map((c) => `"${String(c.accessor(row) ?? '').replace(/"/g, '""')}"`).join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleColumn = (key: string) => {
    const next = new Set(visibleColumns);
    if (next.has(key)) {
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    setVisibleColumns(next);
  };

  return (
    <div className="w-full bg-[#080E1C] border border-white/10 rounded-lg overflow-hidden flex flex-col font-mono text-xs">
      {/* Table Toolbar */}
      <div className="p-3 bg-[#0A1224] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          {title && <h3 className="font-bold text-white text-sm tracking-tight">{title}</h3>}
          {description && <p className="text-[11px] text-white/50">{description}</p>}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filter */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter dataset..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#050914] border border-white/15 rounded px-2.5 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 w-44"
            />
          </div>

          {/* Column selector */}
          <div className="relative">
            <button
              onClick={() => setShowColPicker(!showColPicker)}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-white/15 bg-[#050914] text-white/70 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Cols</span>
            </button>
            {showColPicker && (
              <div className="absolute right-0 mt-1 w-48 bg-[#0A1224] border border-white/15 rounded-lg shadow-xl p-2 z-20 space-y-1">
                <div className="text-[10px] text-white/40 border-b border-white/5 pb-1 mb-1 font-semibold uppercase">
                  Toggle Columns
                </div>
                {columns.map((col) => (
                  <button
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 text-left text-white/80"
                  >
                    <span className="truncate">{col.header}</span>
                    {visibleColumns.has(col.key) && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0A1120] border-b border-white/10 text-white/60 uppercase tracking-wider text-[10px]">
              {columns
                .filter((c) => visibleColumns.has(c.key))
                .map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={`px-3 py-2.5 font-semibold ${
                      col.sortable !== false ? 'cursor-pointer hover:text-white select-none' : ''
                    } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    <div className="flex items-center gap-1 inline-flex">
                      <span>{col.header}</span>
                      {col.unit && <span className="text-cyan-400/80">[{col.unit}]</span>}
                      {col.sortable !== false && (
                        <span className="text-white/30">
                          {sortKey === col.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-3 h-3 text-cyan-400" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-cyan-400" />
                            )
                          ) : (
                            <ArrowUpDown className="w-2.5 h-2.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-white/80">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.filter((c) => visibleColumns.has(c.key)).length}
                  className="px-4 py-8 text-center text-white/40 italic"
                >
                  No matching engineering data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-cyan-500/10 hover:text-white' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  {columns
                    .filter((c) => visibleColumns.has(c.key))
                    .map((col) => {
                      const val = col.accessor(row);
                      return (
                        <td
                          key={col.key}
                          className={`px-3 py-2 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          {val !== null && val !== undefined ? String(val) : '—'}
                        </td>
                      );
                    })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-2.5 bg-[#0A1224] border-t border-white/10 flex items-center justify-between text-white/50 text-[11px]">
        <div>
          Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2 py-0.5 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
          >
            Prev
          </button>
          <span className="px-2 font-mono text-white/70">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-0.5 rounded border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
