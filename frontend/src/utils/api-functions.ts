import firebaseAuth from '../firebase';
import User from '../interfaces/entities/user';
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
 * @param user The user to create.
 * @returns The created user.
 * @throws An error if the user could not be created.
 */
export const createUser = async (user: Pick<User, 'name'>): Promise<User> => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await headers()),
    },
    body: JSON.stringify(user),
  });
  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return data as User;
};
