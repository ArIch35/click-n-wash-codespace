import { defineConfig } from 'cypress';
import loadEnv from './cypressLoad-env';

export default defineConfig({
  env: { ...loadEnv() },
  e2e: {},
});
