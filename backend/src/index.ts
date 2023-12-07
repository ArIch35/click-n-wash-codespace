import 'reflect-metadata';
import express from 'express';
import userRouter from './router/user.router';
import cors from 'cors';
import { connectToDb } from './db';

/**
 * The main entry point for the application.
 * This file is responsible for setting up the express server and the routes.
 */

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

app.use('/user', userRouter);

app.listen(8080, () => {
  console.log('Listening');
});
