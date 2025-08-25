import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    proxy: {
      '/recommend': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
        // ✅ EXCLUDE /auth/callback FROM PROXY
        bypass: (req) => {
          if (req.url.startsWith('/auth/callback')) {
            console.log("Bypassing proxy for /auth/callback");
            return '/index.html'; // React Router will handle this
          }
        },
      },
      '/order': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
});
