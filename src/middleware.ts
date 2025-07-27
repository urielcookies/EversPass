// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { SITE_URL } from '@/lib/constants';

export const onRequest = defineMiddleware((context, next) => {
  const { url, request } = context;
  const pathname = url.pathname;
  const params = url.search;
  const SPA_PAGES = ['/', '/dashboard', '/settings', '/signin', '/signup'];
  
  // Determine if this is app subdomain (you'll need to implement this logic)
  const isAppSubdomain = url.hostname.includes('app.');
  if (isAppSubdomain && !SPA_PAGES.includes(pathname)) {
    return context.redirect(`${SITE_URL}${pathname}${params}`);
  }

  return next();
});