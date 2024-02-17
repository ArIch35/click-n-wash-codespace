import { expect } from 'chai';
import mocha from 'mocha';
import supertest from 'supertest';
import { getBackendUser, mochaInit } from '.';
import dummyGenerator from '../utils/dummy-generator';
import '../utils/load-env';

const TEST_PORT = 5050;
const ROUTER_NAME = '/laundromats';
const api = supertest(`http://localhost:${TEST_PORT}/api`);

mocha.describe('LaudromatController', () => {
  mochaInit();
  let createdLaundromatId: string;

  /**
   * Test the GET /laundromats endpoint.
   */
  mocha.it(
    'GET /laundromats should return a 200 status code and a list of laundromats',
    async () => {
      const res = await api.get(ROUTER_NAME).expect(200);
      expect(res.body).to.be.an('array');
    },
  );

  /**
   * Test the POST /laundromats endpoint.
   */
  mocha.it(
    'POST /laundromats should create a new laundromat and return a 403 because the user is not a vendor',
    async () => {
      const userData = await getBackendUser(2);
      const laundromat = dummyGenerator.generateRandomLaundromat(userData.user);

      const res = await api
        .post(ROUTER_NAME)
        .auth(userData.token, { type: 'bearer' })
        .send({ ...laundromat, id: undefined, owner: undefined })
        .expect(403);

      expect(res.body).to.be.an('object');
    },
  );

  /**
   * TEST the PUT /users endpoint.
   */
  mocha.it('PUT /users to change the user role to vendor', async () => {
    const userData = await getBackendUser(2);
    const res = await api
      .put('/users')
      .auth(userData.token, { type: 'bearer' })
      .send({ isAlsoVendor: true })
      .expect(200);
    expect(res.body).to.be.an('object');
  });

  /**
   * Test the POST /laundromats endpoint.
   */
  mocha.it(
    'POST /laundromats should create a new laundromat and return a 201 status code',
    async () => {
      const userData = await getBackendUser(2);
      const laundromat = dummyGenerator.generateRandomLaundromat(userData.user);

      const res = await api
        .post(ROUTER_NAME)
        .auth(userData.token, { type: 'bearer' })
        .send({ ...laundromat, id: undefined, owner: undefined })
        .expect(201);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      createdLaundromatId = res.body.id;
      expect(res.body).to.be.an('object');
    },
  );

  /**
   * Test the POST /laundromats endpoint with invalid data.
   */
  mocha.it('POST /laundromats should return a 400 status code', async () => {
    const userData = await getBackendUser(2);
    const laundromat = dummyGenerator.generateRandomLaundromat(userData.user);
    const res = await api
      .post(ROUTER_NAME)
      .auth(userData.token, { type: 'bearer' })
      .send({ ...laundromat, price: 'asd' })
      .expect(400);
    expect(res.body).to.be.an('object');
  });

  /**
   * Test the GET /laundromats endpoint with a token.
   */
  mocha.it('GET /laundromats should return a 200 status code', async () => {
    const userData = await getBackendUser(2);
    const res = await api.get(ROUTER_NAME).auth(userData.token, { type: 'bearer' }).expect(200);
    expect(res.body).to.be.an('array');
  });

  /**
   * Test the GET /laundromats/:id endpoint.
   */
  mocha.it('GET /laundromats/:id should return a 200 status code', async () => {
    const userData = await getBackendUser(2);
    const res = await api
      .get(`${ROUTER_NAME}/${createdLaundromatId}`)
      .auth(userData.token, { type: 'bearer' })
      .expect(200);
    expect(res.body).to.be.an('object');
  });

  /**
   * Test the PUT /laundromats/:id endpoint.
   */
  mocha.it('PUT /laundromats/:id should return a 200 status code', async () => {
    const userData = await getBackendUser(2);
    const res = await api
      .put(`${ROUTER_NAME}/${createdLaundromatId}`)
      .auth(userData.token, { type: 'bearer' })
      .send({ name: 'New Name' })
      .expect(200);
    expect(res.body).to.be.an('object');
  });

  /**
   * Test the DELETE /laundromats/:id endpoint.
   */
  mocha.it('DELETE /laundromats/:id should return a 200 status code', async () => {
    const userData = await getBackendUser(2);
    const res = await api
      .delete(`${ROUTER_NAME}/${createdLaundromatId}`)
      .auth(userData.token, { type: 'bearer' })
      .expect(200);
    expect(res.body).to.be.an('object');
  });
});
