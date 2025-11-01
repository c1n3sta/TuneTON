import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// Custom plugin to handle Figma asset imports
const figmaAssetPlugin = () => {
  return {
    name: 'figma-asset-resolver',
    resolveId(source) {
      if (source.startsWith('figma:asset/')) {
        // Return a virtual module ID
        return '\0' + source;
      }
      return null;
    },
    load(id) {
      if (id.startsWith('\0figma:asset/')) {
        // Return a simple placeholder image data URL
        // This is a 1x1 transparent PNG
        return `
          export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
        `;
      }
      return null;
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    figmaAssetPlugin(),
    react(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      webp: {
        quality: 80,
      },
      avif: {
        quality: 50,
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  define: {
    global: 'globalThis',
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
  },
  server: {
    port: 3001,
    host: true,
    open: false,
    cors: true,
  },
  preview: {
    port: 3001,
    host: true,
  },
});