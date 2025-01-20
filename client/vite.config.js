import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Development server runs on port 3000
    open: true, // Automatically opens the app in the browser
    proxy: {
      '/graphql': {
        target: 'http://localhost:3001', // Proxy GraphQL requests to the backend server
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist', // Vite will generate the production build in the 'dist' folder
  },
});