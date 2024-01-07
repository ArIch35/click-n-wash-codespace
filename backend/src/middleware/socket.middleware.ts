import { RequestHandler } from 'express';
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import Notification from '../interfaces/notification';
import { users } from '../utils/constants';

// Middleware
const createSocket = (server: HttpServer): RequestHandler => {
  const socket = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });
  console.log('Socket.io server created');

  socket.on('connection', (client) => {
    console.log(client.id, 'connected');

    client.on('registerUserToSocket', (userId: string) => {
      users[userId] = client.id;
      console.log(`${userId}:${client.id} registered`);
      console.log(users);
    });

    client.on('deleteUserFromSocket', (userId: string | undefined) => {
      if (!userId) {
        return;
      }
      delete users[userId];
      console.log(`${userId}:${client.id} deleted`);
      console.log(users);
    });
  });

  return ((_, res, next) => {
    res.locals.sendNotification = (userId: string, notification: Notification) => {
      if (users[userId]) {
        socket.to(users[userId]).emit('notification', notification);
      }
    };
    next();
  }) as RequestHandler;
};

export default createSocket;
