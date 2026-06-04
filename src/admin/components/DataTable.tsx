import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  loading?: boolean;
  emptyMessage?: string;
  filters?: React.ReactNode;
}

export function DataTable<T extends Record<string, unknown>>({
  data, columns, searchKeys = [], loading, emptyMessage = 'Sin registros',
  filters,
}: DataTableProps<T>) {
  const [search, setSearch]         = useState('');
  const [sortKey, setSortKey]       = useState<string>('');
  const [sortAsc, setSortAsc]       = useState(true);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (search && searchKeys.length) {
      const q = search.toLowerCase();
      rows = rows.filter(row =>
        searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      rows.sort((a, b) => {
        const av = String(a[sortKey] ?? '');
        const bv = String(b[sortKey] ?? '');
        return sortAsc ? av.localeCompare(bv, 'es') : bv.localeCompare(av, 'es');
      });
    }
    return rows;
  }, [data, search, searchKeys, sortKey, sortAsc]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {searchKeys.length > 0 && (
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 340 }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9e8e7e' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar…"
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: 10,
                border: '1px solid #e8e2d9', fontSize: 14, color: '#2a2822',
                background: '#fff', outline: 'none',
              }}
            />
          </div>
        )}
        {filters}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #e8e2d9' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f5f4f2', borderBottom: '1px solid #e8e2d9' }}>
              {columns.map(col => (
                <th key={String(col.key)}
                  style={{
                    padding: '11px 16px', textAlign: 'left', fontWeight: 600,
                    color: '#5a3e2b', whiteSpace: 'nowrap', width: col.width,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.header}
                    {col.sortable && (
                      <span style={{ opacity: sortKey === String(col.key) ? 1 : 0.3 }}>
                        {sortKey === String(col.key) && !sortAsc
                          ? <ChevronDown size={13} />
                          : <ChevronUp size={13} />}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0ede8' }}>
                  {columns.map(col => (
                    <td key={String(col.key)} style={{ padding: '12px 16px' }}>
                      <div style={{ height: 16, background: '#f0ede8', borderRadius: 4, animation: 'pulse 1.5s infinite', width: '70%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '48px 16px', textAlign: 'center', color: '#9e8e7e' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row, i) => (
                <tr key={i} style={{
                  borderBottom: '1px solid #f0ede8',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#faf9f7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >
                  {columns.map(col => (
                    <td key={String(col.key)} style={{ padding: '12px 16px', color: '#2a2822', verticalAlign: 'middle' }}>
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 12, color: '#9e8e7e', marginTop: 8 }}>
        {filtered.length} {filtered.length === 1 ? 'registro' : 'registros'}
        {search && ` · buscando "${search}"`}
      </p>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
    </div>
  );
}
