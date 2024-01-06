import { notifications } from '@mantine/notifications';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from './reducers/root.reducer';
import { routes } from './routeConstants';
import { autoCloseDuration } from './utils/constants';

interface CheckRoute {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVendor?: boolean;
}

/**
 * Show auth required notification only once by hiding previous notification
 */
const showAuthRequiredOnce = () => {
  notifications.hide('auth-required');
  notifications.show({
    id: 'auth-required',
    title: 'Authentication Required',
    message: 'You must be logged in to view this page',
    color: 'red',
    autoClose: autoCloseDuration,
  });
};

/**
 * Show vendor required notification only once by hiding previous notification
 */
const showVendorRequiredOnce = () => {
  notifications.hide('vendor-required');
  notifications.show({
    id: 'vendor-required',
    title: 'Vendor Required',
    message: 'You must be a vendor to view this page',
    color: 'red',
    autoClose: autoCloseDuration,
  });
};

const CheckRoute = ({ children, requireAuth, requireVendor }: CheckRoute) => {
  const auth = useSelector((state: RootState) => state.authenticationState.firebaseData);
  const user = useSelector((state: RootState) => state.authenticationState.user);

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
