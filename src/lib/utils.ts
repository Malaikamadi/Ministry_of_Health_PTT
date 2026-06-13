/** Format large numbers to compact form */
export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return value.toString();
}

/** Format date to display string */
export function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format date to relative time */
export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

/** Get progress bar color class based on percentage */
export function getProgressColor(pct: number): string {
  if (pct >= 75) return 'progress-fill-success';
  if (pct >= 40) return 'progress-fill-primary';
  if (pct >= 20) return 'progress-fill-warning';
  return 'progress-fill-danger';
}

/** Get progress bar inline color based on percentage */
export function getProgressBgColor(pct: number): string {
  if (pct >= 75) return '#2E7D32';
  if (pct >= 40) return '#0F4C81';
  if (pct >= 20) return '#F9A825';
  return '#C62828';
}

/** Get initials from a name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/** Generate a random ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
