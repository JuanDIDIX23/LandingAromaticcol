// ── CSV Export ───────────────────────────────────────────────
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string
): void {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(','),
    ...data.map(row =>
      keys
        .map(key => {
          const val = String(row[key] ?? '');
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob(['﻿' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Formatters ───────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function startOfMonth(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// ── Text helpers ─────────────────────────────────────────────
export function truncate(text: string, max = 60): string {
  return text.length > max ? text.slice(0, max) + '…' : text;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
