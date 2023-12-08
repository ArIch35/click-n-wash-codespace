import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { connectToDb } from './db';
import checkToken from './middleware/auth.middleware';
import { customMessage } from './router/http-return-messages';
import { STATUS_OK } from './router/http-status-codes';
import laundromatRouter from './router/laundromat.router';
import userRouter from './router/user.router';
import washingMachineRouter from './router/washing-machine.router';

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

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(checkToken);
// Add middleware here

app.use('/users', userRouter);
app.use('/laundromats', laundromatRouter);
app.use('/washingmachines', washingMachineRouter);
// Add routes here

app.get('/', (_req, res) => {
  res.status(STATUS_OK).send(customMessage(true, 'Server is running'));
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
