import { createRoute, createRootRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import NotFoundPage from '@/components/NotFound';

const Root = () => (
  <>
    <h1>App SPA</h1>
    <Outlet />
  </>
);

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

const App = () => {
  return <RouterProvider router={router} />;
}

export default App;