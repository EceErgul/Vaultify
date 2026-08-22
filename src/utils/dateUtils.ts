export const formatToDisplayDate = (isoDate?: string): string => {
  if (!isoDate) return '';
  const dateObj = new Date(isoDate);
  if (isNaN(dateObj.getTime())) return '';
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
};

export const parseDisplayDateToISO = (displayDate: string): string => {
  const [d, m, y] = displayDate.split('/');
  return `${y}-${m}-${d}`;
};

export const maskDateInput = (value: string): string => {
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 4) {
    cleaned = cleaned.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
  } else if (cleaned.length > 2) {
    cleaned = cleaned.replace(/(\d{2})(\d+)/, '$1/$2');
  }
  return cleaned.slice(0, 10);
};

export const isValidDisplayDate = (displayDate: string): boolean => {
  if (displayDate.length !== 10) return false;
  const [d, m, y] = displayDate.split('/').map(Number);
  if (!d || !m || !y) return false;
  
  const dateObj = new Date(y, m - 1, d);
  return dateObj.getDate() === d && dateObj.getMonth() === m - 1 && dateObj.getFullYear() === y;
};