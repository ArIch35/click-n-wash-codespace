import { headers, Message } from '.';
import { RequestFilter, SearchFilter } from '../../components/home/Filter';
import Laundromat, { CreateLaundromat } from '../../interfaces/entities/laundromat';
import LaundromatTimeSlots from '../../interfaces/laundromat-time-slots';
import entityParser from '../entity-parser';
import loadEnv from '../load-env';

const route = `${loadEnv().VITE_SERVER_ADDRESS}/laundromats`;

/**
 * Retrieves a list of laundromats from the server.
 *
 * @param onlyOwned - Optional parameter to filter the list of laundromats to only those owned by the user.
 * @returns A promise that resolves to an array of laundromats.
 * @throws An error if the server response is not successful.
 */
export const getLaundromats = async (onlyOwned?: boolean) => {
  const response = await fetch(`${route}/?onlyOwned=${onlyOwned}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  const laundromats = data as Laundromat[];
  laundromats.forEach((laundromat) => {
    if (laundromat.lat && laundromat.lon) {
      laundromat.position = { lat: Number(laundromat.lat), lng: Number(laundromat.lon) };
    }
  });
  return entityParser<Laundromat[]>(data as Laundromat[]);
};

/**
 * Retrieves a laundromat by its ID.
 * @param id - The ID of the laundromat.
 * @returns A Promise that resolves to the laundromat object.
 * @throws An error if the request fails or the response is not successful.
 */
export const getLaundromatById = async (id: string) => {
  const response = await fetch(`${route}/${id}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<Laundromat>(data as Laundromat);
};

/**
 * Retrieves the time slots for a specific laundromat.
 * @param id - The ID of the laundromat.
 * @returns A promise that resolves to an array of laundromat time slots.
 * @throws An error if the API request fails or returns an error message.
 */
export const getLaundromatTimeSlots = async (id: string) => {
  const response = await fetch(`${route}/${id}/occupied-slots`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return entityParser<LaundromatTimeSlots[]>(data as LaundromatTimeSlots[]);
};

/**
 * Creates a new laundromat.
 *
 * @param body - The data for creating the laundromat.
 * @returns A promise that resolves to the created laundromat.
 * @throws An error if the request fails or the response is not successful.
 */
export const createLaundromat = async (body: CreateLaundromat) => {
  const response = await fetch(`${route}`, {
    method: 'POST',
    headers: { ...(await headers()) },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }

  return entityParser<Laundromat>(data as Laundromat);
};

/**
 * Updates a laundromat with the specified ID.
 * @param id - The ID of the laundromat to update.
 * @param body - The updated data for the laundromat.
 * @returns A Promise that resolves to the updated laundromat.
 * @throws An error if the update request fails.
 */
export const updateLaundromat = async (id: string, body: CreateLaundromat) => {
  const response = await fetch(`${route}/${id}`, {
    method: 'PUT',
    headers: { ...(await headers()) },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }

  return entityParser<Laundromat>(data as Laundromat);
};

/**
 * Deletes a laundromat by its ID.
 * @param id - The ID of the laundromat to delete.
 * @throws {Error} If the API request fails or returns an error message.
 */
export const deleteLaundromat = async (id: string) => {
  const response = await fetch(`${route}/${id}`, {
    method: 'DELETE',
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
};

/**
 * Retrieves the filter parameters for the laundromats.
 * @returns A promise that resolves to the filter parameters.
 * @throws An error if the API request fails or returns an error message.
 */
export const getLaundromatFilters = async () => {
  const response = await fetch(`${route}/filter-params`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  return data as RequestFilter;
};

/**
 * Retrieves a list of laundromats from the server.
 *
 * @param filter - The filter parameters to apply to the request.
 * @returns A promise that resolves to an array of laundromats.
 * @throws An error if the server response is not successful.
 */
export const getFilteredLaundromats = async (filter: SearchFilter) => {
  const response = await fetch(`${route}/${queryParamBuilder(filter)}`, {
    headers: { ...(await headers()) },
  });

  const data = (await response.json()) as unknown;
  if (!response.ok) {
    throw new Error((data as Message).message);
  }
  const laundromats = data as Laundromat[];
  laundromats.forEach((laundromat) => {
    if (laundromat.lat && laundromat.lon) {
      laundromat.position = { lat: Number(laundromat.lat), lng: Number(laundromat.lon) };
    }
  });
  return entityParser<Laundromat[]>(laundromats);
};

const queryParamBuilder = (filter: SearchFilter) => {
  let query: string = '?';
  Object.keys(filter).forEach((key) => {
    if (filter[key as keyof SearchFilter] !== undefined) {
      query += `${key}=${filter[key as keyof SearchFilter]}&`;
    }
  });
  return query;
};
