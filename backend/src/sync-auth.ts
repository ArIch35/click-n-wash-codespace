import getDb, { connectToDb } from './db';

connectToDb()
  .then(() =>
    getDb()
      .syncAuth()
      .then(() => {
        console.log('Synced auth');
        process.exit(0);
      }),
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
