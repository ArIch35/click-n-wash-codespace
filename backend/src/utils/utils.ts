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
