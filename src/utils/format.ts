export function formatCurrency(value: number): string {
  return `INR ${value.toLocaleString('en-IN')}`;
}

export function formatShortDate(value: string): string {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
