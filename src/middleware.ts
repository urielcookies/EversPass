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
  
  // Check if this is a token handoff request
  const hasAuthToken = url.searchParams.has('token');
  
  // Check exact matches OR paths that start with SPA_PATHS
  const isSPARoute = SPA_PAGES.includes(pathname) || SPA_PATHS.some(path => pathname.startsWith(path));
  
  // If this is the app subdomain, we want to serve the SPA
  if (isAppSubdomain) {
    // Allow requests with auth tokens to pass through to SPA routes for processing
    if (!isSPARoute && !hasAuthToken) {
      return context.redirect(`${SITE_URL}${pathname}${params}`);
    }
    
    // If it's a token but not a valid SPA route, redirect to home with token
    if (hasAuthToken && !isSPARoute) {
      const token = url.searchParams.get('token')!;
      return context.redirect(`${url.origin}/?token=${encodeURIComponent(token)}`);
    }
    
    // For valid SPA routes, set a context flag to skip Astro Clerk
    context.locals.isSPA = true;
  }

  return next();
});

// Export the context type for TypeScript
declare global {
  namespace App {
    interface Locals {
      isSPA?: boolean;
    }
  }
}