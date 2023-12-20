import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { connectToDb } from './db';

import http from 'http';
import checkToken from './middleware/auth.middleware';
import createSocket from './middleware/socket.middleware';
import contractRouter from './router/contract.router';
import generateTokenRouter from './router/generate-token.router';
import laundromatRouter from './router/laundromat.router';
import userRouter from './router/user.router';
import washingMachineRouter from './router/washing-machine.router';
import { customMessage } from './utils/http-return-messages';
import { STATUS_NOT_FOUND, STATUS_OK } from './utils/http-status-codes';
import loadEnv from './utils/load-env';

/**
 * Starts the server.
 * @param test If true, the server is started in test mode.
 * @returns The server object.
 */
const server = async (test?: boolean) => {
  await connectToDb(test);
  console.log(`Connected to DB ${loadEnv().DB_NAME}`);

  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(checkToken);
  app.use(createSocket(server));
  // Add middleware here

  app.use('/api/users', userRouter);
  app.use('/api/laundromats', laundromatRouter);
  app.use('/api/washingmachines', washingMachineRouter);
  app.use('/api/contracts', contractRouter);
  app.use('/api/generateToken', generateTokenRouter);
  // Add routes here

  app.use('/', (_req, res) => {
    res.status(STATUS_OK).send(customMessage(true, 'Server is running'));
  });

  app.use('*', (_req, res) => {
    res.status(STATUS_NOT_FOUND).send(customMessage(false, 'Route not found'));
  });

  return server;
};

export default server;
