import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mocha from 'mocha';
import getDb from '../db';
import server from '../server';
import firebaseAuth from '../utils/firebase';

const firebaseUsers = new Map<number, User>();

/**
 * Retrieves a Firebase user by index. If the user does not exist, it creates a new user and returns it.
 *
 * @param index - The index of the user to retrieve or create.
 * @returns The Firebase user.
 */
export const getFirebaseUser = async (index: number) => {
  let firebaseUser = firebaseUsers.get(index);
  if (!firebaseUser) {
    let creds: UserCredential;
    try {
      creds = await signInWithEmailAndPassword(
        firebaseAuth,
        `testuser${index}@test.com`,
        `testuser${index}`,
      );
    } catch (error) {
      creds = await createUserWithEmailAndPassword(
        firebaseAuth,
        `testuser${index}@test.com`,
        `testuser${index}`,
      );
    }
    firebaseUser = creds.user;
    firebaseUsers.set(index, firebaseUser);
  }
  return firebaseUser;
};

/**
 * Retrieves the backend user based on the provided index.
 *
 * @param index - The index of the user to retrieve.
 * @returns An object containing the user and the token.
 * @throws An error if the Firebase user does not have an email.
 */
export const getBackendUser = async (index: number) => {
  const firebaseUser = await getFirebaseUser(index);
  if (!firebaseUser.email) {
    throw new Error('Firebase user does not have an email');
  }
  let user = await getDb().userRepository.findOne({ where: { email: firebaseUser.email } });
  if (!user) {
    user = getDb().userRepository.create({
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: `TestUser${index}`,
      balance: 200,
    });
    await getDb().userRepository.save(user);
  }
  return {
    user,
    token: await firebaseUser.getIdToken(),
  };
};

/**
 * Initializes the Mocha test suite.
 */
export const mochaInit = () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;
  const TEST_PORT = 5050;

  mocha.before(async () => {
    testServer = (await server(true)).listen(TEST_PORT, () => {
      console.log('Test server is running on port ' + TEST_PORT);
    });

    await getDb().dropDatabase();
  });

  mocha.after(() => {
    testServer?.close();
  });
};
