import { expect } from 'chai';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mocha from 'mocha';
import supertest from 'supertest';
import '../utils/load-env';
import server from '../server';
import firebaseAuth from '../utils/firebase';
import {
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import getDb from '../db';

const TEST_PORT = 5050;
const api = supertest(`http://localhost:${TEST_PORT}`);

mocha.describe('UserController', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

  let userTest1: User | null = null;

  mocha.before(async () => {
    testServer = (await server(true)).listen(TEST_PORT, () => {
      console.log('Test server is running on port ' + TEST_PORT);
    });

    await getDb().dropDatabase();
  });

  /**
   * Test the GET /users endpoint.
   */
  mocha.it('should return an empty list of users', async () => {
    const res = await api.get('/users').expect(200);
    console.log(res.body);
    expect(res.body).to.be.an('array');
  });

  /**
   * Test the POST /users endpoint.
   */
  mocha.it('should create a new user', async () => {
    try {
      // If able to sign in then delete the user
      const existingUserCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        'testuser1@gmail.com',
        'testuser1',
      );

      await deleteUser(existingUserCredential.user);
    } catch (e) {
      console.log(e);
    }

    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      'testuser1@gmail.com',
      'testuser1',
    );

    userTest1 = userCredential.user;

    const userToken = await userTest1.getIdToken();
    const res = await api
      .post('/users')
      .auth(userToken, { type: 'bearer' })
      .send({
        name: 'TestUser1',
      })
      .expect(201);

    expect(res.body).to.be.an('object').contains({
      name: 'TestUser1',
      email: 'testuser1@gmail.com',
      id: userTest1.uid,
    });
  });

  /**
   * Test to POST /users endpoint with an already existing user.
   */
  mocha.it('should return a conflict error', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api
      .post('/users')
      .auth(userToken, { type: 'bearer' })
      .send({
        name: 'TestUser1',
      })
      .expect(409);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Entry Already Exist!, Cancelling....',
    });
  });

  /**
   * Test the GET /users/:idOrEmail endpoint.
   */
  mocha.it('should return the user created in the previous test', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api
      .get(`/users/${userTest1?.uid}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);

    expect(res.body)
      .to.be.an('object')
      .contains({
        name: 'TestUser1',
        email: 'testuser1@gmail.com',
        id: userTest1?.uid,
      });
  });

  /**
   * Test the GET /users/:idOrEmail endpoint with an invalid id.
   */
  mocha.it('should return a not found error', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api.get('/users/123456').auth(userToken, { type: 'bearer' }).expect(404);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Entry Does Not Exist!',
    });
  });

  /**
   * Test the PUT /users endpoint.
   */
  mocha.it('should update the user created in the previous test', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api
      .put('/users')
      .auth(userToken, { type: 'bearer' })
      .send({
        name: 'TestUser1Updated',
      })
      .expect(200);

    expect(res.body)
      .to.be.an('object')
      .contains({
        name: 'TestUser1Updated',
        email: 'testuser1@gmail.com',
        id: userTest1?.uid,
      });
  });

  /**
   * Test the PUT /users endpoint with an invalid id.
   */
  mocha.it('should return a not found error', async () => {
    const userToken = '123456';
    await api
      .put('/users')
      .auth(userToken, { type: 'bearer' })
      .send({
        name: 'TestUser1Updated',
      })
      .expect(401);
  });

  /**
   * Test the DELETE /users endpoint.
   */
  mocha.it('should delete the user created in the previous test', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api.delete('/users').auth(userToken, { type: 'bearer' }).expect(200);

    expect(res.body).to.be.an('object').contains({
      success: true,
      message: 'Request Sucessfull!',
    });
  });

  /**
   * Test the DELETE /users endpoint with an invalid id.
   */
  mocha.it('should return a not found error', async () => {
    const userToken = await userTest1!.getIdToken();
    const res = await api.delete('/users').auth(userToken, { type: 'bearer' }).expect(404);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Entry Does Not Exist!',
    });
  });

  mocha.after(() => {
    testServer?.close();
  });
});
