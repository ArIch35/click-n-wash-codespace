import dotenv from 'dotenv';

dotenv.config({
  path: `./../.env.${process.env.NODE_ENV}`,
});

if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error('FIREBASE_PRIVATE_KEY is not defined');
}

if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error('FIREBASE_CLIENT_EMAIL is not defined');
}

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is not defined');
}

if (!process.env.VITE_FIREBASE_API_KEY) {
  throw new Error('VITE_FIREBASE_API_KEY is not defined');
}

if (!process.env.VITE_FIREBASE_AUTH_DOMAIN) {
  throw new Error('VITE_FIREBASE_AUTH_DOMAIN is not defined');
}

if (!process.env.VITE_FIREBASE_PROJECT_ID) {
  throw new Error('VITE_FIREBASE_PROJECT_ID is not defined');
}

if (!process.env.VITE_FIREBASE_STORAGE_BUCKET) {
  throw new Error('VITE_FIREBASE_STORAGE_BUCKET is not defined');
}

if (!process.env.VITE_FIREBASE_MESSAGING_SENDER_ID) {
  throw new Error('VITE_FIREBASE_MESSAGING_SENDER_ID is not defined');
}

if (!process.env.VITE_FIREBASE_APP_ID) {
  throw new Error('VITE_FIREBASE_APP_ID is not defined');
}

if (!process.env.VITE_FIREBASE_MEASUREMENT_ID) {
  throw new Error('VITE_FIREBASE_MEASUREMENT_ID is not defined');
}

const loadEnv = () => {
  return {
    PORT: process.env.PORT || 8080,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: (process.env.DB_PORT as unknown as number) || 5432,
    DB_USER: process.env.DB_USER || 'cnw-user',
    DB_PASSWORD: process.env.DB_PASSWORD || 'cnw-password',
    DB_NAME: process.env.DB_NAME || 'cnw-db',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    VITE_SERVER_ADDRESS: process.env.VITE_SERVER_ADDRESS || 'http://localhost:8080',
  };
};

export default loadEnv;
