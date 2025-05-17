// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static', // Changed from 'server' to 'static'
  vite: {
    plugins: [tailwindcss()],
  },
});