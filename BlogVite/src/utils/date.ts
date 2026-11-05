import { format } from 'date-fns';

export const formatDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime()) ? format(date, 'dd/MM/yyyy - HH:mm') : 'Invalid Date';
};

const MIN_DATE = new Date('1753-01-01T00:00:00Z');
const MAX_DATE = new Date('9999-12-31T23:59:59Z');

export const isValidDate = (date: Date | null): date is Date =>
  date instanceof Date && !isNaN(date.getTime()) && date >= MIN_DATE && date <= MAX_DATE;
