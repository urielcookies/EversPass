// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { SITE_URL } from '@/lib/constants';

export const onRequest = defineMiddleware((context, next) => {
  const { url, request } = context;
  const pathname = url.pathname;
  const params = url.search;
  const SPA_PAGES = ['/', '/dashboard', '/settings', '/signin', '/signup'];
  const SPA_PATHS = ['/sessions/photos']; // Base paths for dynamic routes
  
  const isAppSubdomain = url.hostname.includes('app.');
  
  // Check exact matches OR paths that start with SPA_PATHS
  const isSPARoute = SPA_PAGES.includes(pathname) || SPA_PATHS.some(path => pathname.startsWith(path));
  
  if (isAppSubdomain && !isSPARoute) {
    return context.redirect(`${SITE_URL}${pathname}${params}`);
  }

  return next();
});