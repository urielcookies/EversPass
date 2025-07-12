// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Get the PORT from Railway's environment variable, default to 8080 for local dev if needed
const RAILWAY_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// Railway containers need to listen on 0.0.0.0
const RAILWAY_HOST = '0.0.0.0';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    host: RAILWAY_HOST,
    port: RAILWAY_PORT
  }),
  site: process.env.PUBLIC_SITE_URL || `http://localhost:${RAILWAY_PORT}`,
  integrations: [tailwind(), react()]
});