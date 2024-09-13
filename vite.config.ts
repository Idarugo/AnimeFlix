import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',   // Punto de entrada para la parte pública
        admin: './admin.html',  // Punto de entrada para la parte administrativa
      },
    },
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
    port: 5173,  // El puerto que estás usando para desarrollo
    hmr: {
      protocol: 'wss',  // WebSocket seguro para el Hot Module Replacement (HMR)
      host: 'localhost',
    },
  },
});
