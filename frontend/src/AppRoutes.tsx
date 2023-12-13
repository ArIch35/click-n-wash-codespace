import { Route, RouteProps, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

export const routes: RouteProps[] = [
  {
    path: '/',
    element: <HomePage />,
    index: true,
  },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route, index) => {
        return <Route key={index} {...route} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
