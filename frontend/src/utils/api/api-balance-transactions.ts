import { Message, headers } from '.';
import BalanceTransaction from '../../interfaces/entities/balance-transaction';
import entityParser from '../entity-parser';
import loadEnv from '../load-env';

const route = `${loadEnv().VITE_SERVER_ADDRESS}/balancetransactions`;

/**
 * Retrieves balance transactions from the API.
 * @returns A promise that resolves to an array of BalanceTransaction objects.
 * @throws An error if the API request fails or returns an error message.
 */
export const getBalanceTransactions = async () => {
  const response = await fetch(`${route}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<BalanceTransaction[]>(data as BalanceTransaction[]);
};
