import React from 'react';
import { useDispatch } from 'react-redux';
import firebaseAuth from '../firebase';
import User from '../interfaces/entities/user';
import { setAuth, setUser } from '../reducers/authentication.reducer';
import { createUser, getUser } from '../utils/api-functions';

const AuthenticationContext = React.createContext<null>(null);

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

  const body: Pick<User, 'name'> = {
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
  const dispatch = useDispatch();
  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      const firebaseUser = user;
      if (!firebaseUser) {
        dispatch(setAuth(null));
        dispatch(setUser(null));
        return;
      }
      firebaseUser
        .getIdToken()
        .then((token) => {
          const { providerId, email, displayName } = user;
          signInToBackend(displayName || email || 'No name')
            .then((user) => {
              dispatch(setUser(user));
              dispatch(setAuth({ token, providerId }));
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    });
    return () => unsubscribe();
  }, [dispatch]);

  return <AuthenticationContext.Provider value={null}>{children}</AuthenticationContext.Provider>;
};

export default AuthenticationProvider;
