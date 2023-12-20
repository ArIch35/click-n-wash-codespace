if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  throw new Error('VITE_FIREBASE_API_KEY is not defined');
}

if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
  throw new Error('VITE_FIREBASE_AUTH_DOMAIN is not defined');
}

if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
  throw new Error('VITE_FIREBASE_PROJECT_ID is not defined');
}

if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) {
  throw new Error('VITE_FIREBASE_STORAGE_BUCKET is not defined');
}

if (!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) {
  throw new Error('VITE_FIREBASE_MESSAGING_SENDER_ID is not defined');
}

if (!import.meta.env.VITE_FIREBASE_APP_ID) {
  throw new Error('VITE_FIREBASE_APP_ID is not defined');
}

if (!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  throw new Error('VITE_FIREBASE_MEASUREMENT_ID is not defined');
}

const loadEnv = () => {
  return {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY as string,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID as string,
    VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
    VITE_SERVER_ADDRESS: (import.meta.env.VITE_SERVER_ADDRESS as string) || 'http://localhost:8080',
  };
};

export default loadEnv;
