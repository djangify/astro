// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for proper path resolution
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    // Add module resolution with aliases
    resolve: {
      alias: {
        '@lib': path.resolve(__dirname, './src/lib'),
        '@components': path.resolve(__dirname, './src/components'),
        '@types': path.resolve(__dirname, './src/types'),
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    // Build optimization for ES modules
    build: {
      target: 'esnext',
      modulePreload: {
        polyfill: true
      },
      rollupOptions: {
        output: {
          format: 'es',
          manualChunks: {
            // Group cart-related modules together
            'cart': ['./src/lib/cart.js']
          }
        }
      }
    },
    // Development server optimization
    server: {
      warmup: {
        clientFiles: ['./src/lib/cart.js'] // Pre-bundle for faster loads
      }
    },
    // Pre-bundle critical modules
    optimizeDeps: {
      include: ['./src/lib/cart.js'] // Pre-bundle for development
    }
  },
  image: {
    domains: ["corrison.corrisonapi.com", "via.placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "corrison.corrisonapi.com",
        pathname: "/media/**"
      }
    ]
  }
});