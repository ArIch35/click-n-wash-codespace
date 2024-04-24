import admin from 'firebase-admin';
import './utils/load-env';
import loadEnv from './utils/load-env';

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: loadEnv().FIREBASE_CLIENT_EMAIL,
    privateKey: loadEnv().FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: loadEnv().FIREBASE_PROJECT_ID,
  }),
});

export default admin;
