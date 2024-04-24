import { RequestHandler } from 'express';
import { FirebaseError } from 'firebase-admin';
import admin from '../firebase-admin';
import { routesWithoutAuth } from '../utils/constants';
import { customMessage } from '../utils/http-return-messages';
import { STATUS_UNAUTHORIZED } from '../utils/http-status-codes';
import { openApiRoute } from '../utils/utils';

// Middleware
const checkToken: RequestHandler = (async (req, res, next) => {
  // Skip auth if it is a GET request and not API endpoints
  const skipAuth =
    (req.method === 'GET' && !req.path.startsWith('/api')) ||
    req.path.startsWith(openApiRoute) ||
    routesWithoutAuth.some((route) => {
      const path1 = route.path.toLocaleLowerCase();
      const path2 = path1.slice(-1) !== '/' ? `${path1}/` : path1;
      return (
        route.method === req.method &&
        (path1 === req.path.toLocaleLowerCase() || path2 === req.path.toLocaleLowerCase())
      );
    });

  try {
    if (!req.headers.authorization) {
      throw new Error('Authorization Header is Missing!');
    }

    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin
      .auth()
      .verifyIdToken(idToken)
      .catch((error: FirebaseError) => {
        throw new Error(error.message);
      });
    const { uid, email } = decodedToken;
    res.locals = { uid, email };
    next();
  } catch (error) {
    if (skipAuth) {
      return next();
    }
    res.status(STATUS_UNAUTHORIZED).send(customMessage(false, (error as Error).message));
  }
}) as RequestHandler;

export default checkToken;
