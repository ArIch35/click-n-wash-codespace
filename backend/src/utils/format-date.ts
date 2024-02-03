/**
 * Format date to string (dd.mm.yyyy hh:mm)
 * @param date Date to format
 * @returns Formatted date
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export default formatDate;
