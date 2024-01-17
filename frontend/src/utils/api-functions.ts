import firebaseAuth from '../firebase';
import BalanceTransaction from '../interfaces/entities/balance-transaction';
import Contract from '../interfaces/entities/contract';
import Laundromat, { CreateLaundromat } from '../interfaces/entities/laundromat';
import User, { CreateUser, UpdateUser } from '../interfaces/entities/user';
import WashingMachine, { CreateWashingMachine } from '../interfaces/entities/washing-machine';
import entityParser from './entity-parser';
import loadEnv from './load-env';

interface Message {
  success: boolean;
  message: string;
}

/**
 * Gets the authorization headers for the current user.
 * @returns The authorization headers.
 * @throws An error if the user is not logged in.
 */
const headers = async () => {
  const token = await firebaseAuth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('No token found');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Gets a user from the server.
 * @param id The id of the user to get.
 * @returns The user.
 * @throws An error if the user could not be retrieved.
 */
export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/users/${id}`, {
    headers: { ...(await headers()) },
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return data as User;
};

/**
 * Creates a user on the server.
 * @param body the values to create the user with.
 * @returns The created user.
 * @throws An error if the user could not be created.
 */
export const createUser = async (body: CreateUser): Promise<User> => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return data as User;
};

/**
 * Updates a user on the server.
 * @param body The values to update the user with.
 * @returns The updated user.
 * @throws An error if the user could not be updated.
 */
export const updateUser = async (body: UpdateUser): Promise<User> => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/users`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return data as User;
};

/**
 * Sends a request to top up the user's balance with the specified amount.
 * @param amount - The amount to top up the balance with.
 * @throws {Error} If the request fails, an error with the error message is thrown.
 */
export const topupBalance = async (amount: number) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/users/topup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify({ amount }),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Gets all laundromats from the server.
 * @param onlyOwned Whether to only get the laundromats owned by the current user.
 * @returns The laundromats.
 * @throws An error if the laundromats could not be retrieved.
 **/
export const getLaundromats = async (onlyOwned?: boolean) => {
  const response = await fetch(
    `${loadEnv().VITE_SERVER_ADDRESS}/laundromats/?onlyOwned=${onlyOwned}`,
    {
      headers: { ...(await headers()) },
    },
  );

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Laundromat[]>(data as Laundromat[]);
};

/**
 * Creates a laundromat on the server.
 * @param body The values to create the laundromat with.
 * @throws An error if the laundromat could not be created.
 */
export const createLaundromat = async (body: CreateLaundromat) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/laundromats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }

  return entityParser<Laundromat>(data as Laundromat);
};

/**
 * Gets all washing machines with laundromat id from the server.
 * @param id The id of the laundromat.
 * @returns The washing machines.
 * @throws An error if the washing machines could not be retrieved.
 */
export const getWashingMachinesByLaundromatId = async (id: string) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/laundromats/${id}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Laundromat>(data as Laundromat);
};

/**
 * Creates a washing machine on the server.
 * @param id The id of the laundromat.
 * @param body The values to create the washing machine with.
 * @throws An error if the washing machine could not be created.
 */
export const createWashingMachine = async (body: CreateWashingMachine) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/washingmachines`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }

  return entityParser<WashingMachine>(data as WashingMachine);
};

export const getAllWashingMachinesContractsById = async (id: string) => {
  const response = await fetch(
    `${loadEnv().VITE_SERVER_ADDRESS}/washingmachines/${id}/occupied-slots`,
    {
      headers: { ...(await headers()) },
    },
  );

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<{ start: Date; end: Date }[]>(data as { start: Date; end: Date }[]);
};

/**
 * Gets all contracts created by the user from the server.
 * @returns The contracts.
 * @throws An error if the contracts could not be retrieved.
 */
export const getContracts = async () => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/contracts`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Contract[]>(data as Contract[]);
};

/**
 * Creates a contract on the server.
 * @param id The id of the washing machine.
 * @param startDate The start date of the contract.
 * @returns The created contract.
 * @throws An error if the contract could not be created.
 */
const ONE_HOUR = 3600000;
export const bookWashingMachine = async (id: string, startDate: Date) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/contracts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
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
 * Cancels a contract on the server.
 * @param id The id of the contract.
 */
export const cancelContract = async (id: string) => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/contracts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify({
      status: 'cancelled',
    }),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Retrieves the balance transactions from the server.
 * @returns A promise that resolves to an array of BalanceTransaction objects.
 * @throws An error if the server response is not successful.
 */
export const getBalanceTransactions = async () => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/balancetransactions`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<BalanceTransaction[]>(data as BalanceTransaction[]);
};
