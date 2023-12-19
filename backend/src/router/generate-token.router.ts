import dotenv from 'dotenv';
import { RequestHandler, Router } from 'express';
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import firebaseAuth from '../utils/firebase';
import { customMessage } from '../utils/http-return-messages';
import { STATUS_OK, STATUS_SERVER_ERROR } from '../utils/http-status-codes';

dotenv.config({
  path: '../.env',
});

// USED FOR TESTING PURPOSES ONLY, THE CLIENT SHOULD REQUEST THE REFRESH TOKEN FROM FIREBASE
const router: Router = Router();

router.get('/', (async (req, res) => {
  const body = req.body as {
    email?: string;
    password?: string;
  };
  if (!body.email || !body.password) {
    res
      .status(STATUS_SERVER_ERROR)
      .json(customMessage(false, 'Email and password are required to generate a token.'));
    return;
  }
  let user: UserCredential;
  try {
    user = await signInWithEmailAndPassword(firebaseAuth, body.email, body.password);
  } catch (error) {
    user = await createUserWithEmailAndPassword(firebaseAuth, body.email, body.password);
  }
  const token = await user.user.getIdToken();
  res.status(STATUS_OK).json({ token });
}) as RequestHandler);

export default router;
