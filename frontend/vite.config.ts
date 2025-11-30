// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://backend-production-3c0b.up.railway.app/',
          //http://localhost:8080/api/v1 
          changeOrigin: true,
          secure: false,
          // ← BỎ REWRITE VÌ KHÔNG CẦN
        },
      },
    },
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'), // ← ĐÚNG: trỏ vào src/
      },
    },
  };
});