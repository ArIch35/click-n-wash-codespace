import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { connectToDb } from './db';

import checkToken from './middleware/auth.middleware';
import contractRouter from './router/contract.router';
import generateTokenRouter from './router/generate-token.router';
import laundromatRouter from './router/laundromat.router';
import userRouter from './router/user.router';
import washingMachineRouter from './router/washing-machine.router';
import { customMessage } from './utils/http-return-messages';
import { STATUS_NOT_FOUND, STATUS_OK } from './utils/http-status-codes';
import http from 'http';
import createSocket from './middleware/socket.middleware';

/**
 * The main entry point for the application.
 * This file is responsible for setting up the express server and the routes.
 */
const PORT = process.env.PORT || 8080;

connectToDb()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.error('Failed to connect to DB', err);
  });
/*
Import { signInWithEmailAndPassword } from 'firebase/auth';
import firebaseAuth from './utils/firebase';
signInWithEmailAndPassword(firebaseAuth, 'testuser1@gmail.com', 'testuser1').then((userCredential) => {
  userCredential.user.getIdToken().then((_) => {
    // Console.log(_);
  }); 
}); */


const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(checkToken);
app.use(createSocket(server));
// Add middleware here

app.use('/users', userRouter);
app.use('/laundromats', laundromatRouter);
app.use('/washingmachines', washingMachineRouter);
app.use('/contracts', contractRouter);
app.use('/generateToken', generateTokenRouter);
// Add routes here

app.get('/', (_req, res) => {
  res.status(STATUS_OK).send(customMessage(true, 'Server is running'));
});

app.use('*', (_req, res) => {
  res.status(STATUS_NOT_FOUND).send(customMessage(false, 'Route not found'));
});

server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
