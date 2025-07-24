import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';
import { SignIn, SignUp, SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '@clerk/clerk-react'
import { useEffect } from 'react';
import { SITE_URL } from '@/lib/constants';

const Root = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  console.log(user)
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/signin' });
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

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signin',
  component: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <SignIn />
    </div>
  ),
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <SignUp />
    </div>
  ),
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