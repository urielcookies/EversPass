import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server'
import { SITE_URL } from './lib/constants'

const isProtectedRoute = createRouteMatcher(['/app(.*)'])
const isPublicRoute = createRouteMatcher(['/', '/sessions(.*)', '/pricing(.*)']) // this wont work since theyre all static

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId } = auth()
  
  // // If user is authenticated and on a public route, redirect to /app.       // this wont work since theyre all static
  // if (userId && isPublicRoute(context.request)) {
  //   console.log('Redirecting authenticated user to /app')
  //   return context.redirect('/app')
  // }
  
  // If user is not authenticated and on a protected route, redirect to sign in
  if (!userId && isProtectedRoute(context.request)) {
    return context.redirect(SITE_URL)
  }
})