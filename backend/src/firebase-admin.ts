import admin from 'firebase-admin';
import './utils/load-env';

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
});

export default admin;
