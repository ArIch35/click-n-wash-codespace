import 'reflect-metadata';
import server from './server';

const PORT = process.env.PORT || 8080;

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
