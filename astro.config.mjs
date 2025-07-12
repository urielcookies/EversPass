// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Railway injects a PORT environment variable. We'll use it.
// For local development (e.g., `npm run dev`), process.env.PORT might not exist, so default to 8080.
const SERVER_PORT = parseInt(process.env.PORT || '8080', 10);

// It is CRITICAL for containerized environments like Railway that your server
// listens on 0.0.0.0, not localhost.
const SERVER_HOST = '0.0.0.0';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    // 🔑 Explicitly set host and port here, overriding any defaults
    host: SERVER_HOST,
    port: SERVER_PORT
  }),
  // Use the PUBLIC_PROD_SITE_URL for the site config, or localhost for dev.
  // This will be used by import.meta.env.SITE
  site: process.env.PUBLIC_PROD_SITE_URL || `http://localhost:${SERVER_PORT}`,
  integrations: [tailwind(), react()]
});