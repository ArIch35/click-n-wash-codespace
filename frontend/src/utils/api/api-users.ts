import { headers, Message } from '.';
import User, { CreateUser, UpdateUser } from '../../interfaces/entities/user';
import entityParser from '../entity-parser';
import loadEnv from '../load-env';

const route = `${loadEnv().VITE_SERVER_ADDRESS}/users`;

/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise that resolves to the retrieved User object.
 * @throws An Error if the API request fails or returns an error message.
 */
export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`${route}/${id}`, {
    headers: { ...(await headers()) },
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<User>(data as User);
};

/**
 * Creates a new user.
 * @param body - The user data to be sent in the request body.
 * @returns A Promise that resolves to the created user.
 * @throws An error if the request fails or returns an error message.
 */
export const createUser = async (body: CreateUser): Promise<User> => {
  const response = await fetch(`${route}`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<User>(data as User);
};

/**
 * Updates a user's information.
 * @param body - The updated user data.
 * @returns A Promise that resolves to the updated User object.
 * @throws An Error if the API request fails.
 */
export const updateUser = async (body: UpdateUser): Promise<User> => {
  const response = await fetch(`${route}`, {
    method: 'PUT',
    headers: { ...(await headers()) },
    body: JSON.stringify(body),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<User>(data as User);
};

/**
 * Marks the specified messages as read.
 * @param messageIds - An array of message IDs to mark as read.
 * @throws {Error} If the API request fails or returns an error message.
 */
export const markAsRead = async (messageIds: string[]) => {
  const response = await fetch(`${route}/read`, {
    method: 'PUT',
    headers: { ...(await headers()) },
    body: JSON.stringify({ messageIds }),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Sends a request to top up the user's balance.
 * @param amount - The amount to top up.
 * @throws Error if the request fails.
 */
export const topupBalance = async (amount: number) => {
  const response = await fetch(`${route}/topup`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify({ amount }),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};
