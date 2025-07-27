import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet, useLocation } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';
import { useEffect } from 'react';
import { SITE_URL } from '@/lib/constants';
import { includes } from 'lodash-es';

// Import page components
import Home from '@/components/SPA/pages/Home';
import Dashboard from '@/components/SPA/pages/Dashboard';
import Settings from '@/components/SPA/pages/Settings';
import SignIn from '@/components/SPA/pages/SignIn';
import SignUp from '@/components/SPA/pages/SignUp';

const Root = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isLoaded && !isSignedIn && !includes(['/signin', '/signup'], pathname)) {
      window.location.href = SITE_URL;
    }
  }, [isLoaded]);

  return (
    <>
      <Outlet />
    </>
  )
};

const rootRoute = createRootRoute({ component: Root, notFoundComponent: NotFoundPage });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: SignIn,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignUp,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  settingsRoute,
  signInRoute,
  signUpRoute,
]);

const router = createRouter({ routeTree });
const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const App = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}

export default App;