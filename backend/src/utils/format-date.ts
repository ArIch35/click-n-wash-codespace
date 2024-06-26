/**
 * Format date to string (dd.mm.yyyy hh:mm)
 * @param date Date to format
 * @returns Formatted date
 */
const formatDate = (date: Date): string => {
  // Convert to UTC, then to UTC+1
  date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  date = new Date(date.getTime() + 60 * 60 * 1000);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hour}:${minutes}`;
};

export default formatDate;
