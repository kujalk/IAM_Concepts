import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/IAM_Concepts/',
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, 'Pages'),
    },
  },
});
