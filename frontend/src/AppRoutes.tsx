import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { RootState } from './reducers/root.reducer';
import { routes } from './routeConstants';

interface AuthRequiredProps {
  children: React.ReactNode;
  to?: string;
}

const AuthRequired = ({ children, to = '/' }: AuthRequiredProps) => {
  const auth = useSelector((state: RootState) => state.authenticationState.firebaseData);
  const { pathname } = useLocation();
  if (!auth && pathname !== to) {
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
