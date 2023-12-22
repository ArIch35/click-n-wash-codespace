import React from 'react';
import { useDispatch } from 'react-redux';
import firebaseAuth from '../firebase';
import User, { CreateUser } from '../interfaces/entities/user';
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
  const dispatch = useDispatch();
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      const firebaseUser = user;
      if (!firebaseUser) {
        dispatch(setAuth(null));
        dispatch(setUser(null));
        setFetched(true);
        return;
      }
      firebaseUser
        .getIdToken()
        .then(async (token) => {
          const { providerId, email, displayName } = firebaseUser;
          const user = await signInToBackend(displayName || email || 'No name');
          dispatch(setUser(user));
          dispatch(setAuth({ token, providerId }));
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setFetched(true);
        });
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <AuthenticationContext.Provider value={null}>
      {fetched && children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;
