import { defineConfig } from 'cypress';
import loadEnv from './cypressLoad-env';

export default defineConfig({
  env: { ...loadEnv() },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
