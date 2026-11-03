import { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import EmptyState from './EmptyState';

// Generic table: columns = [{ key, header, render?(row), className?, searchable? }]
export default function DataTable({ columns, rows, searchPlaceholder = 'Search…', pageSize = 8, toolbar, emptyTitle = 'No records found', searchable = true }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => columns.some((c) => String(c.searchValue ? c.searchValue(r) : r[c.key] ?? '').toLowerCase().includes(q)));
  }, [rows, columns, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div className="card overflow-hidden">
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-navy-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder={searchPlaceholder} className="input pl-9" aria-label="Search table" />
            </div>
          )}
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}
      {visible.length === 0 ? (
        <div className="p-6"><EmptyState title={emptyTitle} message={query ? 'Try a different search term.' : undefined} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-50/60 text-xs uppercase tracking-wider text-navy-500">
              <tr>{columns.map((c) => <th key={c.key} className={`whitespace-nowrap px-4 py-3 font-semibold ${c.className || ''}`}>{c.header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {visible.map((row, i) => (
                <tr key={row.id || i} className="transition hover:bg-navy-50/40">
                  {columns.map((c) => <td key={c.key} className={`whitespace-nowrap px-4 py-3 text-navy-700 ${c.className || ''}`}>{c.render ? c.render(row) : row[c.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between border-t border-navy-100 px-4 py-3 text-sm text-navy-500">
          <span>Showing {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <button disabled={current === 1} onClick={() => setPage(current - 1)} className="rounded-lg p-1.5 hover:bg-navy-50 disabled:opacity-40" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={current === pages} onClick={() => setPage(current + 1)} className="rounded-lg p-1.5 hover:bg-navy-50 disabled:opacity-40" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
