import { RequestHandler } from 'express';
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

// Middleware
const createSocket = (server: HttpServer): RequestHandler => {
  const socket = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });
  console.log('Socket.io server created');

  return (async (_, res, next) => {
    res.locals.socket = socket;
    next();
  }) as RequestHandler;
};

export default createSocket;
