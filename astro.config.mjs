// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

// Remove or comment out these lines as they might be overriding what you need
// const RAILWAY_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
// const RAILWAY_HOST = '0.0.0.0';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    // ❌ Remove these lines if they are here
    // host: RAILWAY_HOST,
    // port: RAILWAY_PORT
  }),
  site: process.env.PUBLIC_SITE_URL || `http://localhost:${process.env.PORT || 8080}`, // Adjust fallback if you revert PORT parsing
  integrations: [tailwind(), react()]
});