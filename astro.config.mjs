// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
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