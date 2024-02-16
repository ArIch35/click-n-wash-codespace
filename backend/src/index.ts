import 'reflect-metadata';
import server, { getSocket } from './server';
import { users } from './utils/constants';
import loadEnv from './utils/load-env';
import sendNotification from './utils/send-notification';

const PORT = loadEnv().PORT;

/**
 * The main entry point for the application.
 * This file is responsible for setting up the express server and the routes.
 */
server()
  .then((app) => {
    const appInstance = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    const socket = getSocket();

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
    signals.forEach((signal) => {
      process.on(signal, () => {
        console.log(`Received ${signal}, shutting down`);
        socket?.close();
        Object.keys(users).forEach((userId) => {
          sendNotification(userId, {
            title: 'Server',
            message: 'Server is shutting down',
            autoClose: false,
            color: 'red',
          });
        });
        appInstance.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
      });
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
