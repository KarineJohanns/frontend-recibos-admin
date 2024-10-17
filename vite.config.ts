import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


//utilizar base: '', para admin.karine.pt
//utilizar base: '/admin/', para 144.22.133.136/admin
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173, // Defina a porta desejada aqui
    host: true,
  },
  base: '',
  build: {
    outDir:'dist',
    emptyOutDir: true,
  }
});
