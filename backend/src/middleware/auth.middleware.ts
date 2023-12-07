import { RequestHandler } from 'express';
import { FirebaseError } from 'firebase-admin';
import admin from '../firebase';
import { customMessage } from '../router/http-return-messages';
import { STATUS_UNAUTHORIZED } from '../router/http-status-codes';

// Middleware
const checkToken: RequestHandler = (async (req, res, next) => {
  // Skip authentication on GET requests
  if (req.method === 'GET') {
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
    const { uid } = decodedToken;
    res.locals.uid = uid;
    next();
  } catch (error) {
    res.status(STATUS_UNAUTHORIZED).send(customMessage(false, (error as Error).message));
  }
}) as RequestHandler;

export default checkToken;
