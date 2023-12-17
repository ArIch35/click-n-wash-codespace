import axios from 'axios';
import dotenv from 'dotenv';
import { RequestHandler, Router } from 'express';
import admin from '../firebase-admin';
import { MESSAGE_SERVER_ERROR } from '../utils/http-return-messages';
import { STATUS_OK, STATUS_SERVER_ERROR } from '../utils/http-status-codes';
import loadEnv from '../utils/load-env';

dotenv.config({
  path: '../.env',
});

interface ResponseData {
  idToken: string;
  // Include any other properties you expect to receive
}

// USED FOR TESTING PURPOSES ONLY, THE CLIENT SHOULD REQUEST THE REFRESH TOKEN FROM FIREBASE
const router: Router = Router();

router.get('/:uid', (async (req, res) => {
  const { uid } = req.params;
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    const apiKey = loadEnv().VITE_FIREBASE_API_KEY; // Replace with your Firebase API Key

    // Exchange the custom token for an ID token
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        token: customToken,
        returnSecureToken: true,
      },
    );

    const data: ResponseData = response.data as ResponseData;
    const idToken: string = data.idToken;
    res.status(STATUS_OK).json({ token: idToken });
  } catch (error) {
    res.status(STATUS_SERVER_ERROR).json(MESSAGE_SERVER_ERROR);
  }
}) as RequestHandler);

export default router;
