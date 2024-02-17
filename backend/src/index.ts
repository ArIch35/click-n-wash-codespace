import child_process from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import { IncomingMessage, Server, ServerResponse } from 'http';
import 'reflect-metadata';
import server, { getSocket } from './server';
import { users } from './utils/constants';
import loadEnv from './utils/load-env';
import sendNotification from './utils/send-notification';
import { openApiSpecPath } from './utils/utils';

const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
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

    signals.forEach((signal) => {
      process.removeAllListeners(signal);
    });

    server.close(() => resolve());
  });
  return closePromise;
};

const initServer = async () => {
  const app = await server();
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
let previousHash = fs.existsSync('.openapi-hash') ? fs.readFileSync('.openapi-hash', 'utf8') : '';
fs.watchFile(openApiSpecPath, {}, (file) => {
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

  // Get the file content and hash it
  const fileContent = fs.readFileSync(openApiSpecPath, 'utf8');
  const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

  // If the file hash has not changed, do nothing
  if (fileHash === previousHash) {
    console.log('OpenAPI file has not changed');
    return;
  }

  // If the file hash has changed, write it to the previousHash and save the new hash to a file
  console.log('OpenAPI file has changed');
  previousHash = fileHash;
  fs.writeFileSync('.openapi-hash', fileHash);

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
