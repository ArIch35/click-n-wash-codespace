import { defineConfig } from 'cypress';
import fs from 'fs';
import loadEnv from './cypressLoad-env';

export default defineConfig({
  env: { ...loadEnv() },
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        readFileMaybe(filename: string) {
          if (fs.existsSync(filename)) {
            return fs.readFileSync(filename, 'utf8');
          }

          return null;
        },
      });
    },
  },
});
