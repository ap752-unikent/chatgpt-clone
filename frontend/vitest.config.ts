/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables using `describe`, `test`, and `expect` globally
    environment: 'jsdom', // Required for testing React components
  },
});
