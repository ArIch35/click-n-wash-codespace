import child_process from 'child_process';
import fs from 'fs';
import { IncomingMessage, Server, ServerResponse } from 'http';
import 'reflect-metadata';
import server, { getSocket } from './server';
import { users } from './utils/constants';
import loadEnv from './utils/load-env';
import sendNotification from './utils/send-notification';
import { openApiSpecPath } from './utils/utils';

const PORT = loadEnv().PORT;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const closeServer = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const closePromise = new Promise<void>((resolve) => {
    const socket = getSocket();
    socket?.close();
    Object.keys(users).forEach((userId) => {
      sendNotification(userId, {
        title: 'Shutdown',
        message: 'Server is shutting down',
        autoClose: false,
        color: 'red',
      });
    });

    server.close(() => resolve());
  });
  return closePromise;
};

const initServer = async () => {
  const app = await server();
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, shutting down`);
      closeServer(app)
        .then(() => {
          console.log('Server closed');
          process.exit(0);
        })
        .catch((error) => {
          console.error(error);
          process.exit(1);
        });
    });
  });
  return app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

let myServer: Server<typeof IncomingMessage, typeof ServerResponse>;

// Watch for changes in the OpenAPI file
type status = 'checking' | 'generating' | 'exist';
let currentStatus: status = 'checking';
fs.watchFile(openApiSpecPath, {}, (file) => {
  console.log('OpenAPI file changed');
  if (currentStatus === 'checking') {
    if (!file.isFile()) {
      console.log('OpenAPI file does not exist, generating it now');
      currentStatus = 'generating';
      child_process.exec('npm run test', (error) => {
        if (error) {
          console.error(`exec error: ${error.message}`);
          return;
        }
        console.log('OpenAPI file generated');
        currentStatus = 'exist';
      });
      return;
    }
    console.log('OpenAPI file exists');
    currentStatus = 'exist';
  }

  if (currentStatus === 'generating') {
    console.log('OpenAPI file is being generated');
    return;
  }

  const isServerRunning = myServer && myServer.listening;

  if (isServerRunning) {
    console.log('Server is running, restarting the server to apply changes in OpenAPI file');
    closeServer(myServer)
      .then(() => {
        console.log('Server closed');
        initServer()
          .then((server) => {
            myServer = server;
            console.log('Server restarted');
          })
          .catch((error) => {
            console.error(error);
            process.exit(1);
          });
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
    return;
  }

  console.log('Server is not running, starting the server');
  initServer()
    .then((server) => {
      myServer = server;
      console.log('Server started');
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
});

// // If file already exists, start the server
if (fs.existsSync(openApiSpecPath)) {
  initServer()
    .then((server) => {
      myServer = server;
      console.log('Server started');
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
