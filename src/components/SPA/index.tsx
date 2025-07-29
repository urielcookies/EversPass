import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet, useLocation } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';
import { useEffect } from 'react';
import { SITE_URL } from '@/lib/constants';
import { includes } from 'lodash-es';

// Import page components
import Home from '@/components/SPA/pages/Home';
import Photos from '@/components/SPA/pages/Photos';
import Dashboard from '@/components/SPA/pages/Dashboard';
import Settings from '@/components/SPA/pages/Settings';
import SignIn from '@/components/SPA/pages/SignIn';
import SignUp from '@/components/SPA/pages/SignUp';

const Root = () => {
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

const photoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sessions/photos/$sessionId',
  component: Photos,
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
  photoRoute,
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
    <RouterProvider router={router} />
  );
}

export default App;