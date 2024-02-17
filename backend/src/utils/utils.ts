import Contract from '../entities/contract';

/**
 * Generates a random number between the specified minimum and maximum values (inclusive).
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A random number between the minimum and maximum values.
 */
export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Sorts an array of contracts based on their status and start date.
 * Ongoing contracts are sorted based on the time difference between their start date and the current time.
 * Non-ongoing contracts are sorted based on their status.
 * @param contracts - The array of contracts to be sorted.
 * @returns The sorted array of contracts.
 */
export const statusSort = (contracts: Contract[]) => {
  const currentTime = new Date().getTime();
  /**
   * Sorts contracts based on their status and start date.
   * Ongoing contracts are sorted based on the time difference between their start date and the current time.
   * Non-ongoing contracts are sorted based on their status.
   * @param a - The first contract to compare.
   * @param b - The second contract to compare.
   * @returns A negative value if `a` should be sorted before `b`, a positive value if `a` should be sorted after `b`,
   *          or 0 if `a` and `b` have the same sorting order.
   */
  const sortBasedOnStatus = (a: Contract, b: Contract) => {
    if (a.status === 'ongoing' && b.status === 'ongoing') {
      const aTimeDifference = Math.abs(a.startDate.getTime() - currentTime);
      const bTimeDifference = Math.abs(b.startDate.getTime() - currentTime);
      return aTimeDifference - bTimeDifference;
    } else if (a.status === 'ongoing') {
      return -1;
    } else if (b.status === 'ongoing') {
      return 1;
    }

    return 0;
  };
  contracts.sort(sortBasedOnStatus);
};

/**
 * Generates a random date within the specified range.
 * @param start - The start date of the range.
 * @param end - The end date of the range.
 * @returns A random date within the specified range.
 */
export const randomDate = (start: Date, end: Date) => {
  const VALID_BOOKING_HOURS_AS_STRING = [
    '00:00',
    '02:00',
    '04:00',
    '06:00',
    '08:00',
    '10:00',
    '12:00',
    '14:00',
    '16:00',
    '18:00',
    '20:00',
    '22:00',
  ];

  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  const randomTimestamp = randomNumber(startTimestamp, endTimestamp);
  const randomDate = new Date(randomTimestamp);

  const randomTimeString =
    VALID_BOOKING_HOURS_AS_STRING[randomNumber(0, VALID_BOOKING_HOURS_AS_STRING.length - 1)];
  const [hours, minutes] = randomTimeString.split(':');
  randomDate.setHours(Number(hours), Number(minutes));

  return randomDate;
};

export const openApiRoute = '/api-docs';
export const openApiSpecPath = `..${openApiRoute}/swagger.json`;
