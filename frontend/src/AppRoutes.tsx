import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './providers/authentication/Authentication.Context';
import { routes } from './routeConstants';
import { showAuthRequiredOnce, showVendorRequiredOnce } from './utils/mantine-notifications';

interface CheckRoute {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVendor?: boolean;
}

const CheckRoute = ({ children, requireAuth, requireVendor }: CheckRoute) => {
  const { auth, user } = useAuth();

  React.useEffect(() => {
    if (requireAuth && !auth) {
      showAuthRequiredOnce();
    } else if (requireVendor && !user?.isAlsoVendor) {
      showVendorRequiredOnce();
    }
  }, [auth, requireAuth, requireVendor, user?.isAlsoVendor]);

  if (requireAuth && !auth) {
    return <Navigate to={'/'} replace />;
  }

  if (requireVendor && !user?.isAlsoVendor) {
    return <Navigate to={'/'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<CheckRoute {...route}>{route.element}</CheckRoute>}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;
