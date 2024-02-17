import firebaseAuth from '../../firebase';
import { GetLocationLaundromat } from '../../interfaces/entities/laundromat';
import loadEnv from '../load-env';

export interface Message {
  success: boolean;
  message: string;
}

export const headers = async () => {
  const token = await firebaseAuth.currentUser?.getIdToken();
  if (!token) {
    console.warn('No token found');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const checkBackendStatus = async () => {
  const response = await fetch(`${loadEnv().VITE_SERVER_ADDRESS}`, {
    headers: { ...(await headers()) },
  });

  if (!response.ok) {
    throw new Error('Backend is not running');
  }
};

/**
 * Retrieves the latitude and longitude coordinates of a given address.
 * @param location - The location object containing the address details.
 * @returns A promise that resolves to an object with the latitude and longitude coordinates.
 * @throws An error if the API request fails or returns an error message.
 */
export const getPositionFromAddress = async (location: GetLocationLaundromat) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?street=${location.street}&city=${location.city}&country=${location.country}&postalcode=${location.postalCode}&format=json&limit=1`,
    {
      headers: { ...(await headers()) },
    },
  );

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data found');
  }

  return data[0] as { lat: string; lon: string };
};

export * from './api-balance-transactions';
export * from './api-contracts';
export * from './api-laundromats';
export * from './api-users';
export * from './api-washing-machines';
