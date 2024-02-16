import { expect } from 'chai';
import mocha from 'mocha';
import supertest from 'supertest';
import { getFirebaseUser, mochaInit } from '.';
import '../utils/load-env';

const TEST_PORT = 5050;
const api = supertest(`http://localhost:${TEST_PORT}/api`);

mocha.describe('UserController', () => {
  mochaInit();

  /**
   * Test the GET /users endpoint.
   */
  mocha.it('GET /users should return a 401 unauthorized', async () => {
    const res = await api.get('/users').expect(401);
    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Authorization Header is Missing!',
    });
  });

  /**
   * Test the POST /users endpoint.
   */
  mocha.it('POST /users should create a new user', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api
      .post('/users')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'TestUser1',
      })
      .expect(201);

    expect(res.body).to.be.an('object').contains({
      name: 'TestUser1',
      email: 'testuser1@test.com',
      id: user.uid,
    });
  });

  /**
   * Test the GET /users endpoint with a token.
   */
  mocha.it('GET /users should return a 403 forbidden', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.get('/users').auth(token, { type: 'bearer' }).expect(403);
    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'You are not allowed to see lists of users!',
    });
  });

  /**
   * Test to POST /users endpoint with an already existing user.
   */
  mocha.it('POST /users should return a conflict error', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api
      .post('/users')
      .auth(token, { type: 'bearer' })
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
  mocha.it('GET /users/:idOrEmail should return a user', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.get(`/users/${user.uid}`).auth(token, { type: 'bearer' }).expect(200);

    expect(res.body).to.be.an('object').contains({
      name: 'TestUser1',
      email: 'testuser1@test.com',
      id: user.uid,
    });
  });

  /**
   * Test the GET /users/:idOrEmail endpoint with an invalid id.
   */
  mocha.it('GET /users/:idOrEmail should return a not found error', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.get('/users/123456').auth(token, { type: 'bearer' }).expect(404);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Entry Does Not Exist!',
    });
  });

  /**
   * Test the PUT /users endpoint.
   */
  mocha.it('PUT /users should update the user created in the previous test', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api
      .put('/users')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'TestUser1Updated',
      })
      .expect(200);

    expect(res.body).to.be.an('object').contains({
      name: 'TestUser1Updated',
      email: 'testuser1@test.com',
      id: user.uid,
    });
  });

  /**
   * Test the PUT /users endpoint with an invalid id.
   */
  mocha.it('PUT /users should return a not found error', async () => {
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
  mocha.it('DELETE /users should delete the user created in the previous test', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.delete('/users').auth(token, { type: 'bearer' }).expect(200);

    expect(res.body).to.be.an('object').contains({
      success: true,
      message: 'Request Sucessfull!',
    });
  });

  /**
   * Test the DELETE /users endpoint with an invalid id.
   */
  mocha.it('DELETE /users should return a not found error', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.delete('/users').auth(token, { type: 'bearer' }).expect(404);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'Entry Does Not Exist!',
    });
  });

  /**
   * Test the POST /users/restore endpoint.
   */
  mocha.it('POST /users/restore should restore the user deleted in the previous test', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.post('/users/restore').auth(token, { type: 'bearer' }).expect(200);

    expect(res.body).to.be.an('object').contains({
      name: 'TestUser1Updated',
      email: 'testuser1@test.com',
      id: user.uid,
    });
  });

  /**
   * Test the POST /users/restore endpoint with a restored user.
   */
  mocha.it('POST /users/restore should return a conflict error', async () => {
    const user = await getFirebaseUser(1);
    const token = await user.getIdToken();
    const res = await api.post('/users/restore').auth(token, { type: 'bearer' }).expect(409);

    expect(res.body).to.be.an('object').contains({
      success: false,
      message: 'User is not deleted',
    });
  });
});
