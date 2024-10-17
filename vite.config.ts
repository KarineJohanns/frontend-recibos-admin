import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Defina a base dinamicamente de acordo com a variável de ambiente
const basePath = process.env.REACT_APP_BASE_PATH || '/admin/';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173, // Defina a porta desejada aqui
    host: true,
  },
  base: basePath
});
