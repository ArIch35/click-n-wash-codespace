import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { connectToDb } from './db';

import expressOasGenerator from 'express-oas-generator';
import http from 'http';
import { Server } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import checkToken from './middleware/auth.middleware';
import createSocket from './middleware/socket.middleware';
import balanceTransactionRouter from './router/balance-transaction.router';
import contractRouter from './router/contract.router';
import generateTokenRouter from './router/generate-token.router';
import laundromatRouter from './router/laundromat.router';
import userRouter from './router/user.router';
import washingMachineRouter from './router/washing-machine.router';
import { customMessage } from './utils/http-return-messages';
import { STATUS_NOT_FOUND } from './utils/http-status-codes';
import loadEnv from './utils/load-env';
import { openApiRoute, openApiSpecPath } from './utils/utils';

/**
 * Starts the server.
 * @param test If true, the server is started in test mode.
 * @returns The server object.
 */
const server = async (test?: boolean) => {
  await connectToDb(test);
  console.log(`Connected to DB ${loadEnv().DB_NAME}`);

  const app = express();
  expressOasGenerator.handleResponses(app, {
    specOutputFileBehavior: 'PRESERVE',
    swaggerDocumentOptions: {
      info: {
        title: 'ClickNWash API',
        version: '1.0.0',
      },
    },
    specOutputPath: openApiSpecPath,
  });
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
  app.use('/api/balancetransactions', balanceTransactionRouter);
  app.use('/api/generateToken', generateTokenRouter);
  // Add routes here

  // Redirect to openapi
  app.use('/docs', (_req, res) => {
    res.redirect(openApiRoute);
  });

  app.use(express.static('public'));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith(openApiRoute)) {
      return next();
    }
    res.sendFile('index.html', { root: 'public' }, (err) => {
      if (err) {
        res.status(404).send({ message: 'Frontend not found' });
      }
    });
  });

  app.use('*', (req, res, next) => {
    if (req.originalUrl.startsWith(openApiRoute)) {
      return next();
    }
    res.status(STATUS_NOT_FOUND).send(customMessage(false, 'Route not found'));
  });

  expressOasGenerator.handleRequests();
  return server;
};

export default server;

let socket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown> | undefined;
export const getSocket = () => {
  return socket;
};
export const setSocket = (
  newSocket: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
) => {
  socket = newSocket;
};
