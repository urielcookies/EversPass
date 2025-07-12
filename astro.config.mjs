import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  site: process.env.NODE_ENV === 'development'
    ? 'http://localhost:4321'
    : process.env.PUBLIC_PROD_SITE_URL,
  integrations: [tailwind(), react()]
});
