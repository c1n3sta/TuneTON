import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory and its parent directories
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    assetsInclude: ['**/*.old'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    worker: {
      format: 'es',
    },
    define: {
      'import.meta.env.PROD': JSON.stringify(mode === 'production'),
      'import.meta.env.DEV': JSON.stringify(mode !== 'production'),
    },
    server: command === 'serve' ? {
      port: 3000,
      open: true,
      strictPort: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
          ws: true,
          configure: (proxy: any) => {
            proxy.on('error', (err: Error) => {
              console.log('Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq: any, req: any) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes: any, req: any) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          }
        },
      },
    } : undefined,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            tone: ['tone'],
          },
          // Ensure consistent file names for better caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      // Copy public assets to the dist folder
      assetsInlineLimit: 0,
      // Ensure the base path is set correctly
      base: './',
      // Enable source maps for production debugging
      sourcemap: true,
    },
  };
});
