import firebaseAuth from '../../firebase';

export interface Message {
  success: boolean;
  message: string;
}

export const headers = async () => {
  const token = await firebaseAuth.currentUser?.getIdToken();
  if (!token) {
    throw new Error('No token found');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export * from './api-balance-transactions';
export * from './api-contracts';
export * from './api-laundromats';
export * from './api-users';
export * from './api-washing-machines';
