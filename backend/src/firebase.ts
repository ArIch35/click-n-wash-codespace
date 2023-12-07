import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config({
  path: '../.env',
});

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});
const auth = admin.auth();

export default auth;
