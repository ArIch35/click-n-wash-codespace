import 'reflect-metadata';
import getDb from './db';
import server from './server';
import loadEnv from './utils/load-env';

const PORT = loadEnv().PORT;

/**
 * The main entry point for the application.
 * This file is responsible for setting up the express server and the routes.
 */
server()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    getDb()
      .syncAuth()
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(err);
  });
