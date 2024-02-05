/**
 * Returns the color associated with the given status.
 * @param status - The status of the booking.
 * @returns The color string.
 */
export const getColor = (status: string) => {
  switch (status) {
    case 'ongoing':
      return 'green';
    case 'finished':
      return 'blue';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};
