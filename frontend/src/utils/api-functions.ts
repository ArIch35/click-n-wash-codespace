import firebaseAuth from '../firebase';
import User, { CreateUser, UpdateUser } from '../interfaces/entities/user';
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
