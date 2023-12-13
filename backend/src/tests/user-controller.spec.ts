import { expect } from 'chai';
import { IncomingMessage, Server, ServerResponse } from 'http';
import mocha from 'mocha';
import supertest from 'supertest';
import '../utils/load-env';
import server from '../server';
import firebaseAuth from '../utils/firebase';
import { User, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import getDb from '../db';

const api = supertest('http://localhost:5000');

mocha.describe('UserController', () => {
  let testServer: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

  let userTest1: User | null = null;

  mocha.before(async () => {
    testServer = (await server(true)).listen(5000, () => {
      console.log('Test server is running on port 5000');
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

  mocha.after(async () => {
    testServer?.close();

    if (!userTest1) {
      throw new Error('User not created');
    }

    await deleteUser(userTest1);
  });
});
