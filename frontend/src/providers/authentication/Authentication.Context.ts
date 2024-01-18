import React from 'react';
import User from '../../interfaces/entities/user';

export interface Auth {
  token: string;
  providerId: string;
}

interface AuthenticationContext {
  auth: Auth | null;
  user: User | null;
  registeredName: string;
  setRegisteredName: (name: string) => void;
  refreshUser: () => void;
}

const authenticationContext = React.createContext<AuthenticationContext | null>(null);

/**
 * Custom hook that provides access to the authentication context.
 * @returns The authentication context.
 * @throws Error If used outside of an AuthenticationProvider.
 */
export const useAuth = () => {
  const context = React.useContext(authenticationContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationProvider');
  }
  return context;
};

export default authenticationContext;
