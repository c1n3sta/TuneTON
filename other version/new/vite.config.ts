import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'bundle-analyzer-report.html',
      gzipSize: true,
      brotliSize: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'TuneTON',
        short_name: 'TuneTON',
        description: 'Music streaming and NFT marketplace on TON',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      { find: '@/components', replacement: path.resolve(__dirname, './components') },
      { find: '@/utils', replacement: path.resolve(__dirname, './utils') },
      { find: '@/styles', replacement: path.resolve(__dirname, './styles') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './hooks') },
      { find: '@/assets', replacement: path.resolve(__dirname, './assets') },
    ],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis',
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: mode !== 'production',
    cssCodeSplit: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@ton/')) {
              return 'vendor-ton';
            }
            if (id.includes('@telegram')) {
              return 'vendor-telegram';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'lucide-react',
      '@telegram-apps/sdk',
      '@supabase/supabase-js',
      '@ton/core',
      '@ton/ton',
    ],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  server: {
    port: 3000,
    host: true,
    open: false,
    cors: true,
  },
  preview: {
    port: 3001,
    host: true,
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));