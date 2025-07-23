import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';
import { SignIn, SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '@clerk/clerk-react'
import { useEffect } from 'react';
import { SITE_URL } from '@/lib/constants';

const Root = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  console.log(user)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      window.location.href = SITE_URL;
    }
  }, [isLoaded]);

  return (
    <>
      <h1>App SPA</h1>
      <Outlet />
    </>
  )
};

const rootRoute = createRootRoute({ component: Root, notFoundComponent: NotFoundPage });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home Page</div>,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <div>Dashboard Page</div>,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <div>Settings Page</div>,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  dashboardRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });
const PUBLISHABLE_KEY = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

const App = () => {


  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SignInButton mode="modal"/>
      <br />
      <SignOutButton />
      <br />
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}

export default App;