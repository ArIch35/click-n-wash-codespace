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
