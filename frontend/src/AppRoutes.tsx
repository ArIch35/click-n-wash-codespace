import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RootState } from './reducers/root.reducer';
import { routes } from './routeConstants';
import { autoCloseDuration } from './utils/constants';

interface AuthRequiredProps {
  children: React.ReactNode;
  to?: string;
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

const AuthRequired = ({ children, to = '/' }: AuthRequiredProps) => {
  const auth = useSelector((state: RootState) => state.authenticationState.firebaseData);
  const { pathname } = useLocation();
  if (!auth && pathname !== to) {
    showAuthRequiredOnce();
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        const element = route.requireAuth ? (
          <AuthRequired>{route.element}</AuthRequired>
        ) : (
          route.element
        );
        return <Route key={index} path={route.path} element={element} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
