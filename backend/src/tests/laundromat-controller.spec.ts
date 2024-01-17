import { expect } from 'chai';
import { User, UserCredential, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mocha from 'mocha';
import supertest from 'supertest';
import getDb from '../db';
import server from '../server';
import firebaseAuth from '../utils/firebase';
import '../utils/load-env';

const TEST_PORT = 5050;
const ROUTER_NAME = '/laundromats';
const api = supertest(`http://localhost:${TEST_PORT}/api`);

mocha.describe('LaudromatController', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

  let userTest1: User | null = null;
  let userCredentialTest1: UserCredential | null = null;

  mocha.before(async () => {
    testServer = (await server(true)).listen(TEST_PORT, () => {
      console.log('Test server is running on port ' + TEST_PORT);
    });

    await getDb().dropDatabase();

    userCredentialTest1 = await createUserWithEmailAndPassword(
      firebaseAuth,
      'testUser1Laudromat@gmail.com',
      'testUser1Laundromat',
    );

    userTest1 = userCredentialTest1.user;
  });

  /**
   * Test the GET /laundromats endpoint.
   */
  mocha.it('should return an empty list of laudromats', async () => {
    const res = await api.get(ROUTER_NAME).expect(200);
    console.log(res.body);
    expect(res.body).to.be.an('array');
  });

  mocha.after(async () => {
    testServer?.close();

    if (!userTest1) {
      throw new Error('User not created');
    }

    await deleteUser(userTest1);
  });
});
