import { RequestHandler } from 'express';
import { FirebaseError } from 'firebase-admin';
import admin from '../firebase-admin';
import { routesWithoutAuth } from '../utils/constants';
import { customMessage } from '../utils/http-return-messages';
import { STATUS_UNAUTHORIZED } from '../utils/http-status-codes';

// Middleware
const checkToken: RequestHandler = (async (req, res, next) => {
  const skipAuth = routesWithoutAuth.some(
    (route) =>
      (route.path.toLocaleLowerCase() + route.path.slice(-1) !== '/' ? '/' : '') ===
        req.path.toLocaleLowerCase() &&
      route.method.toLocaleLowerCase() === req.method.toLocaleLowerCase(),
  );
  if (skipAuth) {
    return next();
  }

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
    res.status(STATUS_UNAUTHORIZED).send(customMessage(false, (error as Error).message));
  }
}) as RequestHandler;

export default checkToken;
