import React from 'react';
import firebaseAuth from '../../firebase';
import User, { CreateUser } from '../../interfaces/entities/user';
import { createUser, getUser } from '../../utils/api';
import AuthenticationContext, { Auth } from './Authentication.Context';

interface AuthenticationProviderProps {
  children: React.ReactNode;
}

/**
 * Sign in to backend
 * @param name User name
 * @returns User
 * @throws Error if user is not logged in
 */
const signInToBackend = async (name: string) => {
  if (firebaseAuth.currentUser === null) {
    throw new Error('User is not logged in');
  }

  const body: CreateUser = {
    name: name || 'No name',
  };
  let user: User;

  try {
    // Try to get user from backend
    user = await getUser(firebaseAuth.currentUser.uid);
  } catch (error) {
    // If user doesn't exist, create it
    user = await createUser(body);
  }
  return user;
};

const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  const [firebaseData, setFirebaseData] = React.useState<Auth | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [registeredName, setRegisteredName] = React.useState<string>('');
  const [refresh, setRefresh] = React.useState<boolean>(false);

  const refreshUser = () => {
    setRefresh(!refresh);
  };

  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      const firebaseUser = user;
      if (!firebaseUser) {
        setFirebaseData(null);
        setUser(null);
        setFetched(true);
        return;
      }
      firebaseUser
        .getIdToken()
        .then(async (token) => {
          const { providerId, email, displayName } = firebaseUser;
          const name = registeredName || displayName || email || 'No name';
          const user = await signInToBackend(name);
          setUser(user);
          setFirebaseData({ token, providerId });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setFetched(true);
          setRegisteredName('');
        });
    });
    return () => unsubscribe();
  }, [registeredName, refresh]);

  return (
    <AuthenticationContext.Provider
      value={{ auth: firebaseData, user, registeredName, setRegisteredName, refreshUser }}
    >
      {fetched && children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
