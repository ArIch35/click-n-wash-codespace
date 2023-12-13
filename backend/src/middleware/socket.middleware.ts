import { RequestHandler } from 'express';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { users } from './users';

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
    });
  });

  return ((_, res, next) => {
    res.locals.socket = socket;
    next();
  }) as RequestHandler;
};

export default createSocket;
