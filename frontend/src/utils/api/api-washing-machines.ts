import { headers, Message } from '.';
import WashingMachine, { CreateWashingMachine } from '../../interfaces/entities/washing-machine';
import entityParser from '../entity-parser';
import loadEnv from '../load-env';

const route = `${loadEnv().VITE_SERVER_ADDRESS}/washingmachines`;

/**
 * Creates a new washing machine.
 * @param body - The data for the new washing machine.
 * @returns A promise that resolves to the created washing machine.
 * @throws An error if the request fails.
 */
export const createWashingMachine = async (body: CreateWashingMachine) => {
  const response = await fetch(`${route}`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }

  return entityParser<WashingMachine>(data as WashingMachine);
};

/**
 * Deletes a washing machine by its ID.
 * @param id - The ID of the washing machine to delete.
 * @throws {Error} If the request fails or the response is not successful.
 */
export const deleteWashingMachine = async (id: string) => {
  const response = await fetch(`${route}/${id}`, {
    method: 'DELETE',
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};
