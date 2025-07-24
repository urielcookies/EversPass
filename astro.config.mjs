// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import clerk from '@clerk/astro'

// Railway is explicitly configured for port 4321, so use that.
// The HOST should still be 0.0.0.0 for container accessibility.
const SERVER_PORT = 4321; // 🚀 Use 4321 as configured in Railway
const SERVER_HOST = '0.0.0.0';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
    // These settings should now correctly apply
    host: SERVER_HOST,
    port: SERVER_PORT
  }),
  // This 'server' block is also important for Astro's internal server setup
  server: {
    host: SERVER_HOST,
    port: SERVER_PORT,
  },
  site: process.env.PUBLIC_PROD_SITE_URL || `http://localhost:${SERVER_PORT}`,
  integrations: [tailwind(), react(), clerk()]
});