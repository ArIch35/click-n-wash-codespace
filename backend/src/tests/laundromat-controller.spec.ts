import { expect } from 'chai';
import mocha from 'mocha';
import supertest from 'supertest';
import { mochaInit } from '.';
import '../utils/load-env';

const TEST_PORT = 5050;
const ROUTER_NAME = '/laundromats';
const api = supertest(`http://localhost:${TEST_PORT}/api`);

mocha.describe('LaudromatController', () => {
  mochaInit();

  /**
   * Test the GET /laundromats endpoint.
   */
  mocha.it('should return an empty list of laudromats', async () => {
    const res = await api.get(ROUTER_NAME).expect(200);
    console.log(res.body);
    expect(res.body).to.be.an('array');
  });
});
