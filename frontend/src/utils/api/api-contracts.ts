import { headers, Message } from '.';
import Contract, { BulkCancelContracts } from '../../interfaces/entities/contract';
import entityParser from '../entity-parser';
import loadEnv from '../load-env';

const route = `${loadEnv().VITE_SERVER_ADDRESS}/contracts`;

/**
 * Retrieves the contracts from the server.
 * @returns {Promise<Contract[]>} A promise that resolves to an array of contracts.
 * @throws {Error} If the server response is not successful, an error with the error message is thrown.
 */
export const getContracts = async () => {
  const response = await fetch(`${route}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Contract[]>(data as Contract[]);
};

/**
 * Retrieves a contract by its ID from the server.
 * @param id - The ID of the contract to retrieve.
 * @returns A Promise that resolves to the retrieved contract.
 * @throws An error if the request fails or the contract is not found.
 */
export const getContractById = async (id: string) => {
  const response = await fetch(`${route}/${id}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Contract>(data as Contract);
};

const ONE_HOUR = 3600000;
/**
 * Books a washing machine for a specified start date.
 * @param id - The ID of the washing machine.
 * @param startDate - The start date of the booking.
 * @throws Error if the API request fails.
 */
export const bookWashingMachine = async (id: string, startDate: Date) => {
  const response = await fetch(`${route}`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify({
      startDate: startDate,
      endDate: new Date(startDate.getTime() + ONE_HOUR * 2),
      washingMachine: id,
    }),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Cancels multiple contracts in bulk.
 *
 * @param bulkCancelContracts Start and end date of the time period to cancel contracts in bulk and the laundromat ID.
 */
export const bulkCancelContracts = async (bulkCancelContracts: BulkCancelContracts) => {
  const response = await fetch(`${route}/bulkcancel`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify(bulkCancelContracts),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Cancels a contract.
 * @param id - The ID of the contract to cancel.
 * @throws Error if the API request fails.
 */
export const cancelContract = async (id: string) => {
  const response = await fetch(`${route}/${id}`, {
    method: 'PUT',
    headers: { ...(await headers()) },
    body: JSON.stringify({
      status: 'cancelled',
    }),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};
