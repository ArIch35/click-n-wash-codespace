/**
 * Format date to string (dd.mm.yyyy hh:mm)
 * @param date Date to format
 * @returns Formatted date
 */
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const timezoneOffset = date.getTimezoneOffset();

  return `${day}.${month}.${year} ${hour}:${minutes} (UTC${timezoneOffset > 0 ? '-' : '+'}${
    Math.abs(timezoneOffset) / 60
  })`;
};

export default formatDate;
