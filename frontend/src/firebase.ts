// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import loadEnv from './utils/load-env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: loadEnv().VITE_FIREBASE_API_KEY,
  authDomain: loadEnv().VITE_FIREBASE_AUTH_DOMAIN,
  projectId: loadEnv().VITE_FIREBASE_PROJECT_ID,
  storageBucket: loadEnv().VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: loadEnv().VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: loadEnv().VITE_FIREBASE_APP_ID,
  measurementId: loadEnv().VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export default firebaseAuth;
