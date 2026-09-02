const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatDate(value?: string, fallback = 'A confirmar'): string {
  if (!value) return fallback;

  const date = new Date(DATE_ONLY_PATTERN.test(value) ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start && !end) return 'Datas a confirmar';
  if (!end || end === start) return formatDate(start);
  if (!start) return formatDate(end);
  return `${formatDate(start)} a ${formatDate(end)}`;
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
