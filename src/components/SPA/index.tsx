import { ClerkProvider, useUser } from '@clerk/clerk-react'
import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet, useLocation } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';
import { SignIn, SignUp, SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '@clerk/clerk-react'
import { useEffect, useState } from 'react';
import { SITE_URL } from '@/lib/constants';
import { includes } from 'lodash-es';

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
  component: () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
      // Initialize from DOM class instead of localStorage
      return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
      // Listen for theme changes
      const handleThemeChange = () => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
      };

      // Listen for custom theme change events from Navbar
      window.addEventListener('themeChange', handleThemeChange);

      return () => {
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }, []);

    return (
      <div className={`flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md p-8">
          <SignIn 
            appearance={{
              variables: {
                colorPrimary: '#0ea5e9',
                colorBackground: isDarkMode ? '#020617' : '#ffffff',
                colorInputBackground: isDarkMode ? '#1e293b' : '#f8fafc',
                colorInputText: isDarkMode ? '#f1f5f9' : '#1e293b',
                colorText: isDarkMode ? '#f1f5f9' : '#1e293b',
                borderRadius: '0.5rem',
              },
              elements: {
                card: {
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  boxShadow: isDarkMode 
                    ? '0 10px 25px -3px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                },
                formButtonPrimary: {
                  backgroundColor: '#0ea5e9',
                  '&:hover': {
                    backgroundColor: '#0284c7',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  },
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      // Initial theme setup
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
      
      setIsDarkMode(shouldUseDark);

      // Listen for theme changes
      const handleThemeChange = () => {
        const currentTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldUseDark = currentTheme === 'dark' || (!currentTheme && prefersDark);
        setIsDarkMode(shouldUseDark);
      };

      // Listen for storage changes (when theme is toggled in another tab/component)
      window.addEventListener('storage', handleThemeChange);
      
      // Listen for custom theme change events
      window.addEventListener('themeChange', handleThemeChange);

      return () => {
        window.removeEventListener('storage', handleThemeChange);
        window.removeEventListener('themeChange', handleThemeChange);
      };
    }, []);

    return (
      <div className={`flex items-center justify-center ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
        <div className="w-full max-w-md p-8">
          <SignUp 
            appearance={{
              variables: {
                colorPrimary: '#0ea5e9',
                colorBackground: isDarkMode ? '#020617' : '#ffffff',
                colorInputBackground: isDarkMode ? '#1e293b' : '#f8fafc',
                colorInputText: isDarkMode ? '#f1f5f9' : '#1e293b',
                colorText: isDarkMode ? '#f1f5f9' : '#1e293b',
                borderRadius: '0.5rem',
              },
              elements: {
                card: {
                  backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                  boxShadow: isDarkMode 
                    ? '0 10px 25px -3px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
                },
                formButtonPrimary: {
                  backgroundColor: '#0ea5e9',
                  '&:hover': {
                    backgroundColor: '#0284c7',
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  },
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