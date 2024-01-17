import 'reflect-metadata';
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
  })
  .catch((err) => {
    console.log(err);
  });
